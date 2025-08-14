import { useState, useMemo, useEffect } from 'react'
import { ProductGridSkeleton, LazyImage } from './LoadingStates'
import { NetworkError, EmptyState } from './ErrorHandling'

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    sku: 'SCS-WH1000XM5-BLK',
    name: 'Sony WH-1000XM5 Black',
    price: 7990000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe chống ồn cao cấp với công nghệ V1 processor',
    stock: 25,
    warranty: 12
  },
  {
    id: 2,
    sku: 'SCS-WH1000XM5-SLV',
    name: 'Sony WH-1000XM5 Silver',
    price: 7990000,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe chống ồn cao cấp màu bạc, thiết kế sang trọng',
    stock: 18,
    warranty: 12
  },
  {
    id: 3,
    sku: 'SCS-WH1000XM4-BLK',
    name: 'Sony WH-1000XM4 Black',
    price: 6490000,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe chống ồn thế hệ 4 với LDAC và Quick Attention',
    stock: 35,
    warranty: 12
  },
  {
    id: 4,
    sku: 'SCS-WF1000XM4-BLK',
    name: 'Sony WF-1000XM4 Black',
    price: 4990000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe True Wireless chống ồn với driver 6mm',
    stock: 45,
    warranty: 12
  },
  {
    id: 5,
    sku: 'SCS-WF1000XM4-SLV',
    name: 'Sony WF-1000XM4 Silver',
    price: 4990000,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe True Wireless chống ồn màu bạc, compact',
    stock: 32,
    warranty: 12
  },
  {
    id: 6,
    sku: 'SCS-WHCH720N-BLK',
    name: 'Sony WH-CH720N Black',
    price: 2990000,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe chống ồn tầm trung với 35 giờ pin',
    stock: 60,
    warranty: 12
  },
  {
    id: 7,
    sku: 'SCS-WHCH720N-BLU',
    name: 'Sony WH-CH720N Blue',
    price: 2990000,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe chống ồn màu xanh, thiết kế trẻ trung',
    stock: 28,
    warranty: 12
  },
  {
    id: 8,
    sku: 'SCS-WFLS900N-BLK',
    name: 'Sony WF-LS900N Black',
    price: 3490000,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe True Wireless chống ồn cho thể thao',
    stock: 22,
    warranty: 12
  },
  {
    id: 9,
    sku: 'SCS-WFC500-WHT',
    name: 'Sony WF-C500 White',
    price: 1490000,
    image: 'https://images.unsplash.com/photo-1608156639585-b3a4735e8b36?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe True Wireless cơ bản, chất lượng Sony',
    stock: 85,
    warranty: 12
  },
  {
    id: 10,
    sku: 'SCS-WFC500-BLK',
    name: 'Sony WF-C500 Black',
    price: 1490000,
    image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=400&h=300&fit=crop&crop=center',
    description: 'Tai nghe True Wireless entry-level màu đen',
    stock: 90,
    warranty: 12
  }
]

const ProductList = ({ onProductClick }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])

  // Simulate API call with loading state
  useEffect(() => {
    let cancelled = false
    
    const loadProducts = async () => {
      if (cancelled) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (cancelled) return // Check again after async operation
        
        // Simulate potential network error (5% chance)
        if (Math.random() < 0.05) {
          throw new Error('Network error')
        }
        
        setProducts(SAMPLE_PRODUCTS)
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
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

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search term (name, description, SKU)
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by price range
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(price => {
        if (price.includes('+')) return [parseInt(price.replace('+', '')), Infinity]
        return parseInt(price)
      })
      
      if (max === undefined) {
        filtered = filtered.filter(product => product.price >= min)
      } else {
        filtered = filtered.filter(product => product.price >= min && product.price <= max)
      }
    }

    return filtered
  }, [products, searchTerm, priceFilter])

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
      <div className="mb-6 md:mb-8 py-6 bg-slate-50 dark:bg-slate-800 sticky top-[70px] xl:top-[80px] 2xl:top-[90px] 3xl:top-[100px] 4xl:top-[120px] 5xl:top-[140px] z-10 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 shadow-sm">
        <h2 className="text-slate-900 dark:text-slate-100 text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9 3xl:mb-10 4xl:mb-12 5xl:mb-14 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24 tracking-tight">📱 Sản Phẩm</h2>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10 5xl:gap-12 items-stretch md:items-center px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
          <div className="relative flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả hoặc SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3.5 md:py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl md:rounded-xl text-base transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm hover:shadow-md"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          </div>
          
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-4 py-3.5 md:py-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl md:rounded-xl text-base bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm hover:shadow-md"
          >
            <option value="">Tất cả giá</option>
            <option value="0-5000000">Dưới 5 triệu</option>
            <option value="5000000-10000000">5 - 10 triệu</option>
            <option value="10000000-20000000">10 - 20 triệu</option>
            <option value="20000000+">Trên 20 triệu</option>
          </select>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={10} />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-9 4xl:gap-10 5xl:gap-12 w-full px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-95 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onProductClick(product)}
            >
              <div className="relative h-48 md:h-52 lg:h-48 overflow-hidden bg-white dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex items-center justify-center group">
                <LazyImage 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 bg-white dark:bg-slate-700"
                  placeholder={<div className="text-4xl text-slate-400">📱</div>}
                />
                <div className="absolute top-2.5 right-2.5 bg-primary-500/90 text-white px-2 py-1 text-xs rounded font-medium">
                  {product.sku}
                </div>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                <div className="flex flex-col gap-1.5">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold">SKU: {product.sku}</div>
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
      ) : (
        <EmptyState 
          icon="🔍"
          title="Không tìm thấy sản phẩm"
          description="Không có sản phẩm nào phù hợp với bộ lọc của bạn."
          action={
            <button
              onClick={() => {
                setSearchTerm('')
                setPriceFilter('')
              }}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              🔄 Xóa bộ lọc
            </button>
          }
        />
      )}
    </div>
  )
}

export default ProductList