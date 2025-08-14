import React from 'react'

// Skeleton Loading Component
export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 md:h-52 lg:h-48 bg-slate-200 dark:bg-slate-700"></div>
    <div className="p-4 md:p-5">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  </div>
)

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Full Page Loading
export const PageLoading = ({ message = 'Đang tải...' }) => (
  <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" className="text-primary-500 mb-4" />
      <p className="text-slate-600 dark:text-slate-400 text-lg">{message}</p>
    </div>
  </div>
)

// Button Loading State
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  className = '', 
  loadingText = 'Đang xử lý...',
  ...props 
}) => (
  <button
    {...props}
    disabled={loading || disabled}
    className={`relative ${className} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" className="text-current mr-2" />
        <span>{loadingText}</span>
      </div>
    )}
    <span className={loading ? 'invisible' : 'visible'}>
      {children}
    </span>
  </button>
)

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-9 4xl:gap-10 5xl:gap-12 w-full px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
)

// Image Loading with Placeholder
export const LazyImage = ({ src, alt, className = '', placeholder = null }) => {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
          {placeholder || <div className="text-slate-400">📷</div>}
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">Không thể tải ảnh</div>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
        />
      )}
    </div>
  )
}
