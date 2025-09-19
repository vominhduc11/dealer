import { useState, useMemo, useEffect } from 'react'
import { ProductGridSkeleton, LazyImage } from './LoadingStates'
import { NetworkError, EmptyState } from './ErrorHandling'
import QuickViewModal from './QuickViewModal'
import Pagination, { usePagination } from './Pagination'
import ProductFilters from './ProductFilters'
import { useNavigate } from 'react-router-dom'
import { productsAPI, handleAPIError } from '../services/api'

// Helper function to parse image JSON string
const parseImageUrl = (imageStr) => {
  try {
    const imageObj = JSON.parse(imageStr)
    return imageObj.imageUrl || ''
  } catch (e) {
    return imageStr // fallback to original string if not JSON
  }
}

// Helper function to transform API product data
const transformProduct = (apiProduct, stock = 0) => {
  return {
    id: apiProduct.id,
    sku: apiProduct.sku || `SCS-${apiProduct.id}`,
    name: apiProduct.name,
    price: apiProduct.price,
    image: parseImageUrl(apiProduct.image),
    description: apiProduct.shortDescription || '',
    stock: stock,
    warranty: 24 // Default 24 months warranty
  }
}

const ProductList = ({ onProductClick }) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Load products from API
  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      if (cancelled) return

      try {
        setLoading(true)
        setError(null)

        const response = await productsAPI.getAll()

        if (cancelled) return

        // Fetch stock count for each product concurrently
        const stockPromises = response.data.map(async (product) => {
          try {
            const stockResponse = await productsAPI.getAvailableCount(product.id)
            return { id: product.id, stock: stockResponse.data }
          } catch (err) {
            console.warn(`Failed to fetch stock for product ${product.id}:`, err)
            return { id: product.id, stock: 0 }
          }
        })

        const stockResults = await Promise.allSettled(stockPromises)
        const stockMap = new Map()

        stockResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            stockMap.set(result.value.id, result.value.stock)
          } else {
            // Fallback to 0 if stock fetch failed
            stockMap.set(response.data[index].id, 0)
          }
        })

        if (cancelled) return

        const transformedProducts = response.data.map(product =>
          transformProduct(product, stockMap.get(product.id) || 0)
        )
        setProducts(transformedProducts)
      } catch (err) {
        if (!cancelled) {
          const errorInfo = handleAPIError(err, false)
          setError(errorInfo.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Handle quick view
  const handleQuickView = (e, product) => {
    e.stopPropagation()
    setQuickViewProduct(product)
    setShowQuickView(true)
  }

  const handleQuickViewClose = () => {
    setShowQuickView(false)
    setQuickViewProduct(null)
  }

  const handleViewDetails = () => {
    if (quickViewProduct) {
      navigate(`/products/${quickViewProduct.id}`)
      handleQuickViewClose()
    }
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower)
      )
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(price => {
        if (price.includes('+')) return [parseInt(price.replace('+', '')), Infinity]
        return parseInt(price)
      })
      
      if (max === undefined) {
        filtered = filtered.filter(product => product.price >= min)
      } else {
        filtered = filtered.filter(product => product.price >= min && product.price <= max)
      }
    }

    // Filter by category (mock implementation)
    if (filters.category) {
      // In real app, products would have category field
      filtered = filtered.filter(product => {
        if (filters.category === 'headphones') return product.name.includes('WH-')
        if (filters.category === 'earphones') return product.name.includes('WF-')
        if (filters.category === 'wireless') return product.name.includes('WF-') || product.name.includes('WH-')
        return true
      })
    }

    // Filter by brand (mock implementation)
    if (filters.brand) {
      if (filters.brand === 'sony') {
        filtered = filtered.filter(product => product.name.toLowerCase().includes('sony'))
      }
    }

    // Filter by availability
    if (filters.availability) {
      if (filters.availability === 'in-stock') {
        filtered = filtered.filter(product => product.stock > 10)
      } else if (filters.availability === 'low-stock') {
        filtered = filtered.filter(product => product.stock <= 10 && product.stock > 0)
      } else if (filters.availability === 'out-of-stock') {
        filtered = filtered.filter(product => product.stock === 0)
      }
    }

    // Filter by warranty
    if (filters.warranty) {
      const warrantyMonths = parseInt(filters.warranty)
      filtered = filtered.filter(product => product.warranty >= warrantyMonths)
    }

    // Sort products
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy]
        let bValue = b[filters.sortBy]
        
        if (filters.sortBy === 'name') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1
        } else {
          return aValue > bValue ? 1 : -1
        }
      })
    }

    return filtered
  }, [products, filters])

  // Pagination logic
  const {
    currentPage,
    totalPages,
    totalItems,
    currentItems: paginatedProducts,
    goToPage
  } = usePagination(filteredProducts, 8) // 8 products per page

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (error) {
    return (
      <div className="pt-[70px] xl:pt-[80px] 2xl:pt-[90px] 3xl:pt-[100px] 4xl:pt-[120px] 5xl:pt-[140px] pb-5 max-w-screen-5xl mx-auto px-4">
        <NetworkError onRetry={handleRetry} message={error} />
      </div>
    )
  }


  return (
    <div className="pt-[70px] xl:pt-[80px] 2xl:pt-[90px] 3xl:pt-[100px] 4xl:pt-[120px] 5xl:pt-[140px] pb-5 max-w-screen-5xl mx-auto px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8 py-6 bg-slate-50 dark:bg-slate-800 sticky top-[70px] xl:top-[80px] 2xl:top-[90px] 3xl:top-[100px] 4xl:top-[120px] 5xl:top-[140px] z-10 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
          <h2 className="text-slate-900 dark:text-slate-100 text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl font-bold tracking-tight">📱 Sản Phẩm</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-primary-500 text-white border-primary-500' 
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredProducts.length} sản phẩm
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
            <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bộ lọc</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Đóng bộ lọc"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <ProductFilters 
                  onFiltersChange={handleFiltersChange}
                  totalProducts={products.length}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
          {/* Desktop Filters Sidebar */}
          {showFilters && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <ProductFilters 
                onFiltersChange={handleFiltersChange}
                totalProducts={products.length}
              />
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-9 4xl:gap-10 5xl:gap-12 w-full">
            {paginatedProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-95 animate-fade-in-up group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onProductClick(product)}
            >
              {/* Quick View Button */}
              <button
                onClick={(e) => handleQuickView(e, product)}
                className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-slate-700 hover:scale-110 shadow-lg"
                title="Xem nhanh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <div className="relative h-48 md:h-52 lg:h-48 overflow-hidden bg-white dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex items-center justify-center group">
                <LazyImage 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 bg-white dark:bg-slate-700"
                  placeholder={<div className="text-4xl text-slate-400">📱</div>}
                />
                {product.sku && !product.sku.startsWith('SCS-') && (
                  <div className="absolute top-2.5 right-2.5 bg-primary-500/90 text-white px-2 py-1 text-xs rounded font-medium">
                    {product.sku}
                  </div>
                )}
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                <div className="flex flex-col gap-1.5">
                  {product.sku && !product.sku.startsWith('SCS-') && (
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold">SKU: {product.sku}</div>
                  )}
                  <div className="text-primary-500 dark:text-primary-400 text-lg font-bold">{formatPrice(product.price)}</div>
                  <div className="text-success-500 dark:text-success-400 text-xs">
                    Còn lại: {product.stock} sản phẩm
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">
                    Bảo hành: {product.warranty} tháng
                  </div>
                </div>
              </div>
            </div>
          ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalItems}
                      itemsPerPage={8}
                      onPageChange={goToPage}
                      className="justify-center"
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState 
                icon="🔍"
                title="Không tìm thấy sản phẩm"
                description="Không có sản phẩm nào phù hợp với bộ lọc của bạn."
                action={
                  <button
                    onClick={() => setFilters({})}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    🔄 Xóa bộ lọc
                  </button>
                }
              />
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={handleQuickViewClose}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  )
}

export default ProductList