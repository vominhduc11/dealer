import { useState } from 'react'
import './WarrantyRegistration.css'

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro Max', warranty: 12 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', warranty: 12 },
  { id: 3, name: 'MacBook Pro M3', warranty: 24 },
  { id: 4, name: 'Dell XPS 13', warranty: 24 },
  { id: 5, name: 'iPad Pro 12.9"', warranty: 12 },
  { id: 6, name: 'AirPods Pro 2', warranty: 12 },
  { id: 7, name: 'Apple Watch Series 9', warranty: 12 },
  { id: 8, name: 'Sony WH-1000XM5', warranty: 12 }
]

const WarrantyRegistration = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    productId: '',
    purchaseDate: '',
    serialNumber: '',
    invoiceNumber: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [warrantyCode, setWarrantyCode] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
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
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập họ tên khách hàng'
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại'
    } else if (!/^[0-9]{10,11}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ'
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email không hợp lệ'
    }
    
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Vui lòng nhập địa chỉ khách hàng'
    }
    
    if (!formData.productId) {
      newErrors.productId = 'Vui lòng chọn sản phẩm'
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Vui lòng chọn ngày mua'
    } else {
      const purchaseDate = new Date(formData.purchaseDate)
      const today = new Date()
      if (purchaseDate > today) {
        newErrors.purchaseDate = 'Ngày mua không thể là ngày tương lai'
      }
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Vui lòng nhập số serial'
    }
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Vui lòng nhập số hóa đơn'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateWarrantyCode = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `WR${timestamp}${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newWarrantyCode = generateWarrantyCode()
      setWarrantyCode(newWarrantyCode)
      setSubmitStatus('success')
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        productId: '',
        purchaseDate: '',
        serialNumber: '',
        invoiceNumber: '',
        notes: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedProduct = () => {
    return SAMPLE_PRODUCTS.find(p => p.id === parseInt(formData.productId))
  }

  const calculateWarrantyExpiry = () => {
    if (!formData.purchaseDate || !formData.productId) return null
    
    const product = getSelectedProduct()
    if (!product) return null
    
    const purchaseDate = new Date(formData.purchaseDate)
    const expiryDate = new Date(purchaseDate)
    expiryDate.setMonth(expiryDate.getMonth() + product.warranty)
    
    return expiryDate.toLocaleDateString('vi-VN')
  }

  const resetForm = () => {
    setSubmitStatus(null)
    setWarrantyCode('')
    setErrors({})
  }

  if (submitStatus === 'success') {
    return (
      <div className="warranty-page">
        <div className="warranty-container">
          <div className="success-result">
            <div className="success-icon">
              <div className="checkmark">✓</div>
            </div>
            
            <h2>🎉 Kích hoạt bảo hành thành công!</h2>
            
            <div className="warranty-card">
              <h3>Thông tin bảo hành</h3>
              
              <div className="warranty-details">
                <div className="detail-row">
                  <span>Mã bảo hành:</span>
                  <span className="warranty-code">{warrantyCode}</span>
                </div>
                <div className="detail-row">
                  <span>Khách hàng:</span>
                  <span>{formData.customerName}</span>
                </div>
                <div className="detail-row">
                  <span>Sản phẩm:</span>
                  <span>{getSelectedProduct()?.name}</span>
                </div>
                <div className="detail-row">
                  <span>Ngày mua:</span>
                  <span>{new Date(formData.purchaseDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="detail-row">
                  <span>Hết hạn bảo hành:</span>
                  <span className="expiry-date">{calculateWarrantyExpiry()}</span>
                </div>
                <div className="detail-row">
                  <span>Serial:</span>
                  <span>{formData.serialNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="success-actions">
              <button 
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ In phiếu bảo hành
              </button>
              <button 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                📝 Đăng ký bảo hành khác
              </button>
            </div>
            
            <div className="warranty-note">
              <p>
                💡 <strong>Lưu ý quan trọng:</strong><br/>
                - Vui lòng lưu giữ mã bảo hành <strong>{warrantyCode}</strong> để tra cứu sau này<br/>
                - Khách hàng có thể tra cứu thông tin bảo hành tại website chính thức<br/>
                - Khi cần bảo hành, vui lòng mang theo sản phẩm và mã bảo hành này
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="warranty-page">
      <div className="warranty-container">
        <div className="warranty-header">
          <h2>Ghi nhận thông tin bảo hành</h2>
          <p>Kích hoạt bảo hành sản phẩm cho khách hàng để có thể tra cứu trên website chính thức</p>
        </div>

        <form onSubmit={handleSubmit} className="warranty-form">
          <div className="form-section">
            <h3>Thông tin khách hàng</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Họ và tên khách hàng *</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={errors.customerName ? 'error' : ''}
                  placeholder="Nhập họ tên đầy đủ"
                  disabled={isSubmitting}
                />
                {errors.customerName && <span className="error-text">{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className={errors.customerPhone ? 'error' : ''}
                  placeholder="Nhập số điện thoại"
                  disabled={isSubmitting}
                />
                {errors.customerPhone && <span className="error-text">{errors.customerPhone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email khách hàng *</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className={errors.customerEmail ? 'error' : ''}
                placeholder="Nhập địa chỉ email"
                disabled={isSubmitting}
              />
              {errors.customerEmail && <span className="error-text">{errors.customerEmail}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="customerAddress">Địa chỉ khách hàng *</label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                className={errors.customerAddress ? 'error' : ''}
                placeholder="Nhập địa chỉ đầy đủ"
                rows="3"
                disabled={isSubmitting}
              />
              {errors.customerAddress && <span className="error-text">{errors.customerAddress}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Thông tin sản phẩm</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="productId">Sản phẩm đã mua *</label>
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className={errors.productId ? 'error' : ''}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn sản phẩm</option>
                  {SAMPLE_PRODUCTS.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Bảo hành {product.warranty} tháng)
                    </option>
                  ))}
                </select>
                {errors.productId && <span className="error-text">{errors.productId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="purchaseDate">Ngày mua *</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className={errors.purchaseDate ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                />
                {errors.purchaseDate && <span className="error-text">{errors.purchaseDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="serialNumber">Số serial sản phẩm *</label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className={errors.serialNumber ? 'error' : ''}
                  placeholder="Nhập số serial"
                  disabled={isSubmitting}
                />
                {errors.serialNumber && <span className="error-text">{errors.serialNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="invoiceNumber">Số hóa đơn *</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  className={errors.invoiceNumber ? 'error' : ''}
                  placeholder="Nhập số hóa đơn"
                  disabled={isSubmitting}
                />
                {errors.invoiceNumber && <span className="error-text">{errors.invoiceNumber}</span>}
              </div>
            </div>

            {formData.productId && formData.purchaseDate && (
              <div className="warranty-preview">
                <div className="preview-card">
                  <h4>Thông tin bảo hành</h4>
                  <div className="preview-row">
                    <span>Sản phẩm:</span>
                    <span>{getSelectedProduct()?.name}</span>
                  </div>
                  <div className="preview-row">
                    <span>Thời gian bảo hành:</span>
                    <span>{getSelectedProduct()?.warranty} tháng</span>
                  </div>
                  <div className="preview-row">
                    <span>Ngày hết hạn:</span>
                    <span className="expiry-highlight">{calculateWarrantyExpiry()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="notes">Ghi chú (tùy chọn)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Thông tin bổ sung về sản phẩm hoặc tình trạng..."
                rows="3"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                '🛡️ Kích hoạt bảo hành'
              )}
            </button>
          </div>
        </form>

        {submitStatus === 'error' && (
          <div className="error-result">
            <p>❌ Có lỗi xảy ra khi đăng ký bảo hành. Vui lòng thử lại.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WarrantyRegistration