import { useState } from 'react'
import './LoginPage.css'

const LoginPage = ({ onLogin }) => {
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (formData.username === 'dealer1' && formData.password === 'password123') {
        const dealerInfo = {
          id: 1,
          username: formData.username,
          name: 'Đại lý ABC',
          email: 'dealer1@example.com'
        }
        onLogin(dealerInfo)
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="logo">
            <h1>TuneZone</h1>
            <p>Portal Đại Lý</p>
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
                required
                disabled={isLoading}
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
                required
                disabled={isLoading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          
          <div className="demo-info">
            <p><strong>Demo:</strong></p>
            <p>Username: dealer1</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage