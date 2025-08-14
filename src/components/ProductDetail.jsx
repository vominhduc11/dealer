import { useState } from 'react'
import './ProductDetail.css'

const ProductDetail = ({ product, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [showNotification, setShowNotification] = useState(false)

  if (!product) {
    return (
        <div className="pt-[70px] xl:pt-[80px] 2xl:pt-[90px] 3xl:pt-[100px] 4xl:pt-[120px] 5xl:pt-[140px] pb-20 md:pb-5 max-w-screen-5xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
        <div className="error-message">
          <p>Không tìm thấy thông tin sản phẩm</p>
          <button className="btn btn-primary" onClick={onBack}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }


  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const getProductSpecs = () => {
    // Thông số kỹ thuật dựa trên SKU
    return {
      'SKU': product.sku,
      'Tên sản phẩm': product.name,
      'Giá': formatPrice(product.price),
      'Tồn kho': `${product.stock} sản phẩm`,
      'Bảo hành': `${product.warranty} tháng`,
      'Mô tả': product.description
    }
  }

  const specs = getProductSpecs()

  return (
      <div className="pt-[70px] xl:pt-[80px] 2xl:pt-[90px] 3xl:pt-[100px] 4xl:pt-[120px] 5xl:pt-[140px] pb-20 md:pb-5 max-w-screen-5xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
      <div className="detail-header">
        <div className="breadcrumb">
          <button className="breadcrumb-btn" onClick={onBack}>
            Sản phẩm
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="product-images">
          <div className="main-image">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="product-info">
          <div className="category-badge">{product.sku}</div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          
          <div className="product-meta">
            <div className="price-info">
              <div className="current-price">{formatPrice(product.price)}</div>
              <div className="price-note">Giá đã bao gồm VAT</div>
            </div>
            
            <div className="stock-info">
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </span>
            </div>
            
            <div className="warranty-info">
              <span>🛡️ Bảo hành: {product.warranty} tháng</span>
            </div>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Số lượng:</label>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                />
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="total-price">
              <strong>Tổng: {formatPrice(product.price * quantity)}</strong>
            </div>
            
            <button 
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <div className="tab-headers">
          <button 
            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Mô tả chi tiết
          </button>
          <button 
            className={`tab-header ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Thông số kỹ thuật
          </button>
          <button 
            className={`tab-header ${activeTab === 'warranty' ? 'active' : ''}`}
            onClick={() => setActiveTab('warranty')}
          >
            Chính sách bảo hành
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h3>Mô tả chi tiết sản phẩm</h3>
              <p>{product.description}</p>
              <p>
                {product.name} là một sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội. 
                Sản phẩm được thiết kế để mang lại trải nghiệm tốt nhất cho người dùng với công nghệ tiên tiến nhất.
              </p>
              <ul>
                <li>Thiết kế cao cấp, sang trọng</li>
                <li>Hiệu năng mạnh mẽ, ổn định</li>
                <li>Tối ưu hóa trải nghiệm người dùng</li>
                <li>Hỗ trợ các tính năng thông minh</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'specs' && (
            <div className="tab-pane">
              <h3>Thông số kỹ thuật</h3>
              <div className="specs-table">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <div className="spec-label">{key}</div>
                    <div className="spec-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'warranty' && (
            <div className="tab-pane">
              <h3>Chính sách bảo hành</h3>
              <div className="warranty-policy">
                <p><strong>Thời gian bảo hành:</strong> {product.warranty} tháng</p>
                <p><strong>Điều kiện bảo hành:</strong></p>
                <ul>
                  <li>Sản phẩm còn trong thời hạn bảo hành</li>
                  <li>Có phiếu bảo hành và hóa đơn mua hàng</li>
                  <li>Lỗi do nhà sản xuất, không do người dùng</li>
                  <li>Sản phẩm chưa bị tác động bởi ngoại lực</li>
                </ul>
                <p><strong>Quy trình bảo hành:</strong></p>
                <ol>
                  <li>Liên hệ trung tâm bảo hành hoặc đại lý</li>
                  <li>Mang sản phẩm và giấy tờ liên quan đến trung tâm</li>
                  <li>Kiểm tra và xác định lỗi</li>
                  <li>Sửa chữa hoặc thay thế sản phẩm</li>
                  <li>Giao sản phẩm về cho khách hàng</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Notification */}
      {showNotification && (
        <div className="cart-notification">
          <div className="notification-content">
            <div className="notification-icon">✓</div>
            <div className="notification-info">
              <h4>Đã thêm vào giỏ hàng!</h4>
              <p>{quantity} × {product.name}</p>
              <p className="notification-price">{formatPrice(product.price * quantity)}</p>
            </div>
            <div className="notification-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail