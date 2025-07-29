import { useState } from 'react'
import './Checkout.css'

const Checkout = ({ cart, totalAmount, onPaymentLater, onPaymentNow }) => {
  const [paymentMethod, setPaymentMethod] = useState('later')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })
  const [errors, setErrors] = useState({})

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên khách hàng'
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao hàng'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const orderData = {
      customerInfo,
      cart,
      totalAmount: totalAmount + totalAmount * 0.1,
      paymentMethod,
      orderDate: new Date().toISOString()
    }

    if (paymentMethod === 'later') {
      onPaymentLater(orderData)
    } else {
      onPaymentNow(orderData)
    }
  }

  const finalTotal = totalAmount + totalAmount * 0.1

  return (
      <div className="checkout-page container">
      <div className="checkout-container">
        <div className="checkout-header">
          <h2>Thanh toán đơn hàng</h2>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Thông tin khách hàng</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Nhập họ tên khách hàng"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Nhập email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Địa chỉ giao hàng *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Nhập địa chỉ giao hàng"
                    rows="3"
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>Phương thức thanh toán</h3>
                
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="later"
                      checked={paymentMethod === 'later'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <span className="option-icon">💳</span>
                        <span className="option-title">Thanh toán sau</span>
                      </div>
                      <p className="option-description">
                        Thanh toán khi nhận hàng (COD). Phí thu hộ: 0đ
                      </p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="now"
                      checked={paymentMethod === 'now'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <span className="option-icon">📱</span>
                        <span className="option-title">Thanh toán ngay</span>
                      </div>
                      <p className="option-description">
                        Thanh toán qua QR Code - Nhanh chóng và an toàn
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary submit-btn">
                  {paymentMethod === 'later' ? 'Xác nhận đặt hàng' : 'Thanh toán ngay'}
                </button>
              </div>
            </form>
          </div>

          <div className="order-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>
              
              <div className="order-items">
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Số lượng: {item.quantity}</p>
                      <div className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="payment-info">
                <div className="payment-method-display">
                  <strong>Phương thức thanh toán:</strong>
                  <span className={`method-badge ${paymentMethod}`}>
                    {paymentMethod === 'later' ? '💳 Thanh toán sau' : '📱 Thanh toán ngay'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout