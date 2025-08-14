import { useState } from 'react'
import './LoginModal.css'

const LoginModal = ({ isOpen, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: "DEALER"
        })
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.dealer || data)
        setFormData({ username: '', password: '' })
      } else {
        setError(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng')
      }
    } catch (error) {
      setError('Lỗi kết nối. Vui lòng kiểm tra server backend.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-content">
          <div className="login-header">
            <h2>🎵 TuneZone Dealer</h2>
            <p>Đăng nhập để truy cập hệ thống</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                '🔐 Đăng nhập'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModal