import { useState, useMemo } from 'react'
import './ProductList.css'

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

  const filteredProducts = useMemo(() => {
    let filtered = SAMPLE_PRODUCTS

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
  }, [searchTerm, priceFilter])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }


  return (
    <div className="product-list container">
      <div className="page-header">
        <h2>Sản Phẩm</h2>
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả hoặc SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">Tất cả giá</option>
            <option value="0-5000000">Dưới 5 triệu</option>
            <option value="5000000-10000000">5 - 10 triệu</option>
            <option value="10000000-20000000">10 - 20 triệu</option>
            <option value="20000000+">Trên 20 triệu</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onProductClick(product)}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-badge">
                  {product.sku}
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <div className="product-sku">SKU: {product.sku}</div>
                  <div className="product-price">{formatPrice(product.price)}</div>
                  <div className="product-stock">
                    Còn lại: {product.stock} sản phẩm
                  </div>
                  <div className="product-warranty">
                    Bảo hành: {product.warranty} tháng
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList