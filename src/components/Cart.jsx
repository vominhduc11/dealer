import './Cart.css'

const Cart = ({ cart, onUpdateItem, onRemoveItem, onCheckout, totalAmount }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateItem(productId, newQuantity)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-container">
          <h2>Giỏ hàng</h2>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page container">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Giỏ hàng ({cart.length} sản phẩm)</h2>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">
                    {formatPrice(item.price)}
                  </div>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(item.id)}
                    title="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="summary-row">
                  <span>VAT (10%):</span>
                  <span>{formatPrice(totalAmount * 0.1)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(totalAmount + totalAmount * 0.1)}</span>
                </div>
              </div>
              
              <div className="checkout-actions">
                <button 
                  className="btn btn-primary checkout-btn"
                  onClick={onCheckout}
                >
                  Tiến hành thanh toán
                </button>
              </div>
              
              <div className="cart-note">
                <p>💡 <strong>Lưu ý:</strong> Giá đã bao gồm VAT và phí vận chuyển miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart