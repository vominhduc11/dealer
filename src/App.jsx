import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './components/LoginPage'
import DashboardLayout from './components/DashboardLayout'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentCompletePage from './pages/PaymentCompletePage'
import QRPaymentPage from './pages/QRPaymentPage'
import WarrantyPage from './pages/WarrantyPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dealerInfo, setDealerInfo] = useState(null)

  useEffect(() => {
    const savedLogin = localStorage.getItem('dealerLogin')
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin)
      setIsLoggedIn(true)
      setDealerInfo(loginData)
    }
    
    // Scroll to top when app loads
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }, [])

  const handleLogin = (loginData) => {
    setIsLoggedIn(true)
    setDealerInfo(loginData)
    localStorage.setItem('dealerLogin', JSON.stringify(loginData))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setDealerInfo(null)
    localStorage.removeItem('dealerLogin')
  }

  return (
    <Router>
      <div className="app">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<DashboardLayout dealerInfo={dealerInfo} onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/products" replace />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="payment-complete" element={<PaymentCompletePage />} />
              <Route path="qr-payment" element={<QRPaymentPage />} />
              <Route path="warranty" element={<WarrantyPage />} />
            </Route>
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App
