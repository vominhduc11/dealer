import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cart from '../components/Cart'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, updateCartItem, removeFromCart, getTotalAmount, clearCart, refreshCart, isLoadingProductInfo } = useCart()

  // Refresh cart data when page loads
  useEffect(() => {
    refreshCart()
  }, [])

  const handleCheckout = () => {
    // Create order data
    const orderData = {
      orderId: `TZ${Date.now().toString().slice(-6)}`,
      totalAmount: getTotalAmount() * 1.1, // Include VAT
      items: cart
    }

    // Clear cart
    clearCart()

    // Navigate to success page with order data
    navigate('/order-success', {
      state: { orderData },
      replace: true
    })
  }

  return (
    <Cart
      cart={cart}
      onUpdateItem={updateCartItem}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
      totalAmount={getTotalAmount()}
      isLoadingProductInfo={isLoadingProductInfo}
    />
  )
}

export default CartPage