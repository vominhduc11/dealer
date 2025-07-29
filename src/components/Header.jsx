import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

const Header = ({ dealerInfo, onLogout, currentPage }) => {
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const navItems = [
    { id: 'products', label: <strong>Sản phẩm</strong>, icon: '📱' },
    { id: 'cart', label: 'Giỏ hàng', icon: '🛒', badge: cartCount > 0 ? cartCount : null },
    { id: 'warranty', label: 'Bảo hành', icon: '🛡️' }
  ]

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'products':
        navigate('/products')
        break
      case 'cart':
        navigate('/cart')
        break
      case 'warranty':
        navigate('/warranty')
        break
      default:
        navigate('/products')
    }
  }

  return (
    <>
      {/* Top Header */}
      <header className="header">
        <div className="header-content container">
          <div className="logo">
            <h2>TuneZone Dealer</h2>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          
          <div className="user-menu">
            <span className="dealer-name">{dealerInfo?.name}</span>
            <button className="btn btn-secondary" onClick={onLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          {navItems.map(item => (
            <button
              key={`bottom-${item.id}`}
              className={`bottom-nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
              {item.badge && <span className="bottom-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Header