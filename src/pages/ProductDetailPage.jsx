import { useNavigate, useLocation, useParams } from 'react-router-dom'
import ProductDetail from '../components/ProductDetail'
import { useCart } from '../context/CartContext'
import { SAMPLE_PRODUCTS } from '../data/products'

const ProductDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { addToCart } = useCart()

  // Get product from location state or find by ID
  const product = location.state?.product || SAMPLE_PRODUCTS.find(p => p.id === parseInt(id))

  const handleBack = () => {
    navigate('/products')
  }

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity)
  }

  return (
    <ProductDetail
      product={product}
      onBack={handleBack}
      onAddToCart={handleAddToCart}
    />
  )
}

export default ProductDetailPage