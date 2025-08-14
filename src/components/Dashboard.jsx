import { useState, useEffect } from 'react'
import Header from './Header'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import Cart from './Cart'
import Checkout from './Checkout'
import PaymentComplete from './PaymentComplete'
import QRPayment from './QRPayment'
import WarrantyRegistration from './WarrantyRegistration'

const Dashboard = ({ dealerInfo, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('products')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [orderData, setOrderData] = useState(null)

  // Scroll to top when component mounts (page reload)
  useEffect(() => {
    const mainContent = document.querySelector('.main-content')
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Instant on page load
      })
    }
  }, [])

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
  }

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleNavigation = (page, data = null) => {
    setCurrentPage(page)
    if (page === 'product-detail' && data) {
      setSelectedProduct(data)
    }
    if (page === 'qr-payment' && data) {
      setOrderData(data)
    }
    
    // Scroll to top when navigating with smooth behavior
    const mainContent = document.querySelector('.main-content')
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'products':
        return <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up"><ProductList onProductClick={(product) => handleNavigation('product-detail', product)} /></div>
      case 'product-detail':
        return (
          <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up">
            <ProductDetail
              product={selectedProduct}
              onBack={() => handleNavigation('products')}
              onAddToCart={addToCart}
            />
          </div>
        )
      case 'cart':
        return (
          <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up">
            <Cart
              cart={cart}
              onUpdateItem={updateCartItem}
              onRemoveItem={removeFromCart}
              onCheckout={() => handleNavigation('checkout')}
              totalAmount={getTotalAmount()}
            />
          </div>
        )
      case 'checkout':
        return (
          <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up">
            <Checkout
              cart={cart}
              totalAmount={getTotalAmount()}
              onPaymentLater={() => {
                clearCart()
                handleNavigation('payment-complete')
              }}
              onPaymentNow={(orderData) => handleNavigation('qr-payment', orderData)}
            />
          </div>
        )
      case 'payment-complete':
        return (
          <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up">
            <PaymentComplete onBackToProducts={() => handleNavigation('products')} />
          </div>
        )
      case 'qr-payment':
        return (
          <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up">
            <QRPayment
              orderData={orderData}
              onPaymentComplete={() => {
                clearCart()
                handleNavigation('payment-complete')
              }}
            />
          </div>
        )
      case 'warranty':
        return <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up"><WarrantyRegistration /></div>
      default:
        return <div className="relative w-full min-h-[calc(100vh-80px)] animate-fade-in-up"><ProductList onProductClick={(product) => handleNavigation('product-detail', product)} /></div>
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 w-full relative transition-colors duration-300">
      <Header
        dealerInfo={dealerInfo}
        onLogout={onLogout}
        currentPage={currentPage}
        onNavigate={handleNavigation}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default Dashboard