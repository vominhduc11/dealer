import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI, productsAPI, getDealerInfo, handleAPIError } from '../services/api'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProductInfo, setIsLoadingProductInfo] = useState(false)

  // Helper function to enrich cart items with product information
  const enrichCartWithProductInfo = async (cartItems) => {
    if (!cartItems || cartItems.length === 0) return cartItems

    setIsLoadingProductInfo(true)
    try {
      const enrichedItems = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const productId = item.productId || item.id
            const response = await productsAPI.getBasicInfo(productId, 'name,image,description')
            const productInfo = response.data || {}
            return {
              ...item,
              name: productInfo.name || item.name,
              image: productInfo.image || item.image,
              description: productInfo.description || item.description
            }
          } catch (error) {
            console.warn(`Failed to fetch product info for ${item.productId || item.id}:`, error)
            return item // Return original item if product fetch fails
          }
        })
      )
      return enrichedItems
    } catch (error) {
      console.error('Failed to enrich cart items:', error)
      return cartItems // Return original items if enrichment fails
    } finally {
      setIsLoadingProductInfo(false)
    }
  }

  // Load cart from server when component mounts
  useEffect(() => {
    const loadCart = async () => {
      const dealerInfo = getDealerInfo()
      if (!dealerInfo?.accountId) {
        return
      }

      try {
        setIsLoading(true)
        const response = await cartAPI.getAll(dealerInfo.accountId)
        if (response && response.data && response.data.items) {
          // Handle API response format: response.data.items contains the cart items
          const cartData = response.data.items || []
          // Enrich cart items with product information
          const enrichedCart = await enrichCartWithProductInfo(cartData)
          setCart(enrichedCart)
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
        // Don't show error notification for initial load
        setCart([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  const addToCart = async (product, quantity = 1, unitPrice = null) => {
    const dealerInfo = getDealerInfo()
    if (!dealerInfo?.accountId) {
      console.error('No dealer info found')
      return
    }

    try {
      setIsLoading(true)

      // Use provided unitPrice or fallback to product.price
      const priceToUse = unitPrice !== null ? unitPrice : product.price

      // Call API to add to cart
      await cartAPI.add(dealerInfo.accountId, product.id, quantity, priceToUse)

      // Refresh cart from server to ensure consistency
      const response = await cartAPI.getAll(dealerInfo.accountId)
      if (response && response.data && response.data.items) {
        const cartData = response.data.items || []
        const enrichedCart = await enrichCartWithProductInfo(cartData)
        setCart(enrichedCart)
      }
    } catch (error) {
      handleAPIError(error)
      // Still update local cart as fallback
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
    } finally {
      setIsLoading(false)
    }
  }

  const updateCartItem = async (productId, quantity, unitPrice) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const dealerInfo = getDealerInfo()
    if (!dealerInfo?.accountId) {
      console.error('No dealer info found')
      return
    }

    try {
      setIsLoading(true)
      await cartAPI.update(dealerInfo.accountId, productId, quantity, unitPrice)

      // Refresh cart from server to ensure consistency
      const response = await cartAPI.getAll(dealerInfo.accountId)
      if (response && response.data && response.data.items) {
        const cartData = response.data.items || []
        const enrichedCart = await enrichCartWithProductInfo(cartData)
        setCart(enrichedCart)
      }
    } catch (error) {
      handleAPIError(error)
      // Still update local cart as fallback
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    const dealerInfo = getDealerInfo()
    if (!dealerInfo?.accountId) {
      console.error('No dealer info found')
      return
    }

    try {
      setIsLoading(true)
      await cartAPI.remove(dealerInfo.accountId, productId)

      // Refresh cart from server to ensure consistency
      const response = await cartAPI.getAll(dealerInfo.accountId)
      if (response && response.data && response.data.items) {
        const cartData = response.data.items || []
        const enrichedCart = await enrichCartWithProductInfo(cartData)
        setCart(enrichedCart)
      }
    } catch (error) {
      handleAPIError(error)
      // Still update local cart as fallback
      setCart(prevCart => prevCart.filter(item => item.id !== productId))
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    const dealerInfo = getDealerInfo()
    if (!dealerInfo?.accountId) {
      console.error('No dealer info found')
      return
    }

    try {
      setIsLoading(true)
      await cartAPI.clear(dealerInfo.accountId)

      // Refresh cart from server to ensure consistency
      const response = await cartAPI.getAll(dealerInfo.accountId)
      if (response && response.data && response.data.items) {
        const cartData = response.data.items || []
        const enrichedCart = await enrichCartWithProductInfo(cartData)
        setCart(enrichedCart)
      } else {
        setCart([])
      }
    } catch (error) {
      handleAPIError(error)
      // Still update local cart as fallback
      setCart([])
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalAmount = () => {
    if (!Array.isArray(cart)) {
      return 0
    }
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    if (!Array.isArray(cart)) {
      return 0
    }
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const refreshCart = async () => {
    const dealerInfo = getDealerInfo()
    if (!dealerInfo?.accountId) {
      console.error('No dealer info found')
      return
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.getAll(dealerInfo.accountId)
      if (response && response.data && response.data.items) {
        const cartData = response.data.items || []
        const enrichedCart = await enrichCartWithProductInfo(cartData)
        setCart(enrichedCart)
      }
    } catch (error) {
      handleAPIError(error)
      setCart([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    cart,
    orderData,
    setOrderData,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getCartCount,
    refreshCart,
    isLoading,
    isLoadingProductInfo
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}