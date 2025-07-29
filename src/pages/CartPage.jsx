import { useNavigate } from 'react-router-dom'
import Cart from '../components/Cart'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, updateCartItem, removeFromCart, getTotalAmount } = useCart()

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <Cart
      cart={cart}
      onUpdateItem={updateCartItem}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
      totalAmount={getTotalAmount()}
    />
  )
}

export default CartPage