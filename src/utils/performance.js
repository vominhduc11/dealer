// Performance monitoring utilities

// Web Vitals measurement
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return

  // Measure Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      switch (entry.entryType) {
        case 'largest-contentful-paint':
          // Send to analytics
          sendMetric('LCP', entry.startTime)
          break
        case 'first-input':
          sendMetric('FID', entry.processingStart - entry.startTime)
          break
        case 'layout-shift':
          if (!entry.hadRecentInput) {
            sendMetric('CLS', entry.value)
          }
          break
      }
    }
  })

  // Observe different entry types
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    observer.observe({ entryTypes: ['first-input'] })
    observer.observe({ entryTypes: ['layout-shift'] })
  } catch (e) {
    console.warn('Performance Observer not supported:', e)
  }

  // Measure TTFB (Time to First Byte)
  const navigationEntry = performance.getEntriesByType('navigation')[0]
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
    sendMetric('TTFB', ttfb)
  }
}

// Send metrics to analytics service
const sendMetric = (name, value) => {
  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true
      })
    }
    
    // Example: Custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric: name, value, timestamp: Date.now() })
    }).catch(console.error)
  }
}

// Resource loading performance
export const measureResourceLoading = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.initiatorType === 'img') {
        // Image resource tracking
      } else if (entry.initiatorType === 'script') {
        // Script resource tracking
      } else if (entry.initiatorType === 'css') {
        // CSS resource tracking
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['resource'] })
  } catch (e) {
    console.warn('Resource Performance Observer not supported:', e)
  }
}

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (!performance.memory) return

  const logMemoryUsage = () => {
    const memory = performance.memory
    // Memory usage tracking: used, total, limit

    // Alert if memory usage is high
    const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    if (usagePercent > 80) {
      console.warn('High memory usage detected:', usagePercent.toFixed(2) + '%')
      sendMetric('MemoryUsage', usagePercent)
    }
  }

  // Log memory usage every 30 seconds, but only in development
  if (process.env.NODE_ENV === 'development') {
    const interval = setInterval(logMemoryUsage, 30000)
    logMemoryUsage() // Initial log
    
    // Return cleanup function
    return () => clearInterval(interval)
  } else {
    logMemoryUsage() // Just log once in production
  }
}

// Long task monitoring
export const monitorLongTasks = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.warn('Long task detected:', {
        duration: entry.duration,
        startTime: entry.startTime,
        name: entry.name
      })
      
      // Send to analytics if task is longer than 100ms
      if (entry.duration > 100) {
        sendMetric('LongTask', entry.duration)
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['longtask'] })
  } catch (e) {
    console.warn('Long Task Observer not supported:', e)
  }
}

// Bundle size analysis
export const analyzeBundleSize = () => {
  const scripts = document.querySelectorAll('script[src]')
  const styles = document.querySelectorAll('link[rel="stylesheet"]')
  
  let totalScriptSize = 0
  let totalStyleSize = 0

  // Estimate script sizes from performance entries
  const resourceEntries = performance.getEntriesByType('resource')
  
  scripts.forEach(script => {
    const entry = resourceEntries.find(e => e.name.includes(script.src))
    if (entry) {
      totalScriptSize += entry.transferSize || 0
    }
  })

  styles.forEach(style => {
    const entry = resourceEntries.find(e => e.name.includes(style.href))
    if (entry) {
      totalStyleSize += entry.transferSize || 0
    }
  })

  // Bundle analysis: scripts, styles, total sizes

  return {
    scriptSize: totalScriptSize,
    styleSize: totalStyleSize,
    totalSize: totalScriptSize + totalStyleSize
  }
}

// Image optimization checker
export const checkImageOptimization = () => {
  const images = document.querySelectorAll('img')
  const issues = []

  images.forEach((img, index) => {
    // Check if image has proper dimensions
    if (img.naturalWidth > img.clientWidth * 2) {
      issues.push({
        element: img,
        issue: 'oversized',
        message: `Image ${index} is ${img.naturalWidth}px but displayed at ${img.clientWidth}px`
      })
    }

    // Check if image has alt text
    if (!img.alt) {
      issues.push({
        element: img,
        issue: 'no-alt',
        message: `Image ${index} missing alt text`
      })
    }

    // Check if image has loading attribute
    if (!img.loading) {
      issues.push({
        element: img,
        issue: 'no-lazy-loading',
        message: `Image ${index} not using lazy loading`
      })
    }
  })

  if (issues.length > 0) {
    console.warn('Image optimization issues found:', issues)
  }

  return issues
}

// Performance budget checker
export const checkPerformanceBudget = () => {
  const budget = {
    LCP: 2500, // 2.5s
    FID: 100,  // 100ms
    CLS: 0.1,  // 0.1
    TTFB: 800, // 800ms
    bundleSize: 500 * 1024 // 500KB
  }

  const results = {
    passed: [],
    failed: []
  }

  // Check bundle size
  const bundleAnalysis = analyzeBundleSize()
  if (bundleAnalysis.totalSize <= budget.bundleSize) {
    results.passed.push('Bundle Size')
  } else {
    results.failed.push({
      metric: 'Bundle Size',
      actual: `${Math.round(bundleAnalysis.totalSize / 1024)}KB`,
      budget: `${Math.round(budget.bundleSize / 1024)}KB`
    })
  }

  // Performance budget results
  return results
}

// Initialize all performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return

  // Only run once
  if (window.__performanceMonitoringInitialized) return
  window.__performanceMonitoringInitialized = true

  // Wait for page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        measureWebVitals()
        measureResourceLoading()
        const memoryCleanup = monitorMemoryUsage()
        monitorLongTasks()
        checkImageOptimization()
        checkPerformanceBudget()
        
        // Store cleanup function
        window.__performanceCleanup = memoryCleanup
      }, 1000)
    })
  } else {
    setTimeout(() => {
      measureWebVitals()
      measureResourceLoading()
      const memoryCleanup = monitorMemoryUsage()
      monitorLongTasks()
      checkImageOptimization()
      checkPerformanceBudget()
      
      // Store cleanup function
      window.__performanceCleanup = memoryCleanup
    }, 1000)
  }
}

// Cleanup function
export const cleanupPerformanceMonitoring = () => {
  if (window.__performanceCleanup) {
    window.__performanceCleanup()
    window.__performanceCleanup = null
  }
  window.__performanceMonitoringInitialized = false
}

// React hook for performance monitoring
import React from 'react'

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = React.useState({})

  React.useEffect(() => {
    initPerformanceMonitoring()
    
    // Custom metric collection
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        setMetrics({
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          domInteractive: navigation.domInteractive - navigation.navigationStart
        })
      }
    }

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics()
    } else {
      window.addEventListener('load', collectMetrics)
    }

    return () => {
      window.removeEventListener('load', collectMetrics)
    }
  }, [])

  return metrics
}
