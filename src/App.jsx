import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginModal from './components/LoginModal'
import DashboardLayout from './components/DashboardLayout'

// Lazy load pages for better performance
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const PaymentCompletePage = lazy(() => import('./pages/PaymentCompletePage'))
const QRPaymentPage = lazy(() => import('./pages/QRPaymentPage'))
const WarrantyPage = lazy(() => import('./pages/WarrantyPage'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))

// Import new components and utilities
import { ErrorBoundary } from './components/ErrorHandling'
import { SkipLink } from './components/AccessibleComponents'
import { initPerformanceMonitoring, cleanupPerformanceMonitoring } from './utils/performance'
import { initAccessibility } from './utils/accessibility'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dealerInfo, setDealerInfo] = useState(null)

  useEffect(() => {
    const savedLogin = localStorage.getItem('dealerLogin')
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin)
      setIsLoggedIn(true)
      setDealerInfo(loginData)
    }
    
    // Scroll to top when app loads
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })

    // Initialize performance monitoring
    initPerformanceMonitoring()
    
    // Initialize accessibility features
    initAccessibility()

    // Cleanup function
    return () => {
      cleanupPerformanceMonitoring()
    }
  }, [])

  const handleLogin = (loginData) => {
    setIsLoggedIn(true)
    setDealerInfo(loginData)
    localStorage.setItem('dealerLogin', JSON.stringify(loginData))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setDealerInfo(null)
    localStorage.removeItem('dealerLogin')
  }

  return (
    <ErrorBoundary>
      <Router>
          <div className="app">
            <SkipLink />

            <Routes>
              {isLoggedIn ? (
                <Route path="/" element={<DashboardLayout dealerInfo={dealerInfo} onLogout={handleLogout} />}>
                  <Route index element={<Navigate to="/products" replace />} />
                  <Route path="products" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <ProductsPage />
                    </Suspense>
                  } />
                  <Route path="products/:id" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <ProductDetailPage />
                    </Suspense>
                  } />
                  <Route path="cart" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <CartPage />
                    </Suspense>
                  } />
                  <Route path="checkout" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <CheckoutPage />
                    </Suspense>
                  } />
                  <Route path="payment-complete" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <PaymentCompletePage />
                    </Suspense>
                  } />
                  <Route path="qr-payment" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <QRPaymentPage />
                    </Suspense>
                  } />
                  <Route path="warranty" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <WarrantyPage />
                    </Suspense>
                  } />
                  <Route path="order-success" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <OrderSuccessPage />
                    </Suspense>
                  } />
                  <Route path="orders" element={
                    <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="text-lg">Loading...</div></div>}>
                      <OrdersPage />
                    </Suspense>
                  } />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/" replace />} />
              )}
            </Routes>

            {/* Login Modal - shows when not logged in */}
            <LoginModal isOpen={!isLoggedIn} onLogin={handleLogin} />

          </div>
        </Router>
    </ErrorBoundary>
  )
}

export default App
