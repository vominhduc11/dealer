import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import { CartProvider } from '../context/CartContext'
import './Dashboard.css'

const DashboardLayout = ({ dealerInfo, onLogout }) => {
  const location = useLocation()
  
  // Get current page from pathname
  const getCurrentPage = () => {
    const path = location.pathname
    if (path.includes('/products/')) return 'product-detail'
    if (path === '/products') return 'products'
    if (path === '/cart') return 'cart'
    if (path === '/checkout') return 'checkout'
    if (path === '/payment-complete') return 'payment-complete'
    if (path === '/qr-payment') return 'qr-payment'
    if (path === '/warranty') return 'warranty'
    return 'products'
  }

  const currentPage = getCurrentPage()

  // Scroll to top when route changes
  useEffect(() => {
    const mainContent = document.querySelector('.main-content')
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      })
    }
  }, [location.pathname])

  return (
    <CartProvider>
      <div className="dashboard">
        <Header
          dealerInfo={dealerInfo}
          onLogout={onLogout}
          currentPage={currentPage}
        />
        <main className="main-content">
          <div key={location.pathname} className="page-transition fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </CartProvider>
  )
}

export default DashboardLayout