// API Service for centralized HTTP requests and error handling

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.tunezone.com'
    : 'http://localhost:8080',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
}

// Custom Error Classes
export class APIError extends Error {
  constructor(message, status, code, originalError = null) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
    this.originalError = originalError
    this.timestamp = new Date().toISOString()
  }
}

export class NetworkError extends APIError {
  constructor(message, originalError = null) {
    super(message, 0, 'NETWORK_ERROR', originalError)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends APIError {
  constructor(message, errors = [], originalError = null) {
    super(message, 400, 'VALIDATION_ERROR', originalError)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export class AuthenticationError extends APIError {
  constructor(message = 'Authentication required', originalError = null) {
    super(message, 401, 'AUTHENTICATION_ERROR', originalError)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends APIError {
  constructor(message = 'Access denied', originalError = null) {
    super(message, 403, 'AUTHORIZATION_ERROR', originalError)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends APIError {
  constructor(message = 'Resource not found', originalError = null) {
    super(message, 404, 'NOT_FOUND_ERROR', originalError)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends APIError {
  constructor(message = 'Internal server error', originalError = null) {
    super(message, 500, 'SERVER_ERROR', originalError)
    this.name = 'ServerError'
  }
}

// Utility function to get dealer info from localStorage
export const getDealerInfo = () => {
  try {
    const savedLogin = localStorage.getItem('dealerLogin')
    if (savedLogin) {
      return JSON.parse(savedLogin)
    }
    return null
  } catch (e) {
    console.warn('Failed to parse saved login data:', e)
    localStorage.removeItem('dealerLogin')
    return null
  }
}

// Request interceptor for adding common headers
const getCommonHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Origin': 'http://localhost:8080'
  }

  // Add authentication token if available
  const dealerInfo = getDealerInfo()
  if (dealerInfo?.accessToken) {
    headers['Authorization'] = `Bearer ${dealerInfo.accessToken}`
  }

  return headers
}

// Request timeout wrapper
const withTimeout = (promise, timeoutMs = API_CONFIG.TIMEOUT) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new NetworkError('Request timeout')), timeoutMs)
    )
  ])
}

// Retry wrapper with exponential backoff
const withRetry = async (fn, maxAttempts = API_CONFIG.RETRY_ATTEMPTS) => {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Don't retry client errors (4xx) or authentication errors
      if (error.status >= 400 && error.status < 500) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
      
      console.warn(`API request failed, retrying... (attempt ${attempt}/${maxAttempts})`)
    }
  }

  throw lastError
}

// Response handler with error mapping
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Request failed'
    let errorData = null

    try {
      errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      // Response is not JSON, use status text
      errorMessage = response.statusText || errorMessage
    }

    // Map status codes to appropriate error types
    switch (response.status) {
      case 400:
        throw new ValidationError(
          errorMessage,
          errorData?.errors || [],
          errorData
        )
      case 401:
        // Clear stored authentication on 401
        localStorage.removeItem('dealerLogin')
        throw new AuthenticationError(errorMessage, errorData)
      case 403:
        throw new AuthorizationError(errorMessage, errorData)
      case 404:
        throw new NotFoundError(errorMessage, errorData)
      case 422:
        throw new ValidationError(
          errorMessage,
          errorData?.errors || [],
          errorData
        )
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(errorMessage, errorData)
      default:
        throw new APIError(errorMessage, response.status, 'HTTP_ERROR', errorData)
    }
  }

  // Parse JSON response
  try {
    return await response.json()
  } catch {
    // Response is not JSON, return empty object
    return {}
  }
}

// Core HTTP methods
const httpRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  const config = {
    ...options,
    headers: {
      ...getCommonHeaders(),
      ...options.headers
    }
  }

  try {
    const response = await withTimeout(
      withRetry(() => fetch(url, config))
    )
    return await handleResponse(response)
  } catch (error) {
    // Wrap fetch errors as NetworkError
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Network request failed. Please check your connection.', error)
    }
    
    // Re-throw known errors
    if (error instanceof APIError) {
      throw error
    }
    
    // Wrap unknown errors
    throw new APIError('An unexpected error occurred', 500, 'UNKNOWN_ERROR', error)
  }
}

// HTTP methods
export const api = {
  get: (endpoint, params = {}) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
    
    const queryString = searchParams.toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return httpRequest(url, { method: 'GET' })
  },

  post: (endpoint, data = {}) => {
    return httpRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  put: (endpoint, data = {}) => {
    return httpRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  patch: (endpoint, data = {}) => {
    return httpRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  delete: (endpoint) => {
    return httpRequest(endpoint, { method: 'DELETE' })
  },

  // File upload
  upload: (endpoint, formData) => {
    const headers = getCommonHeaders()
    delete headers['Content-Type'] // Let browser set Content-Type for FormData
    
    return httpRequest(endpoint, {
      method: 'POST',
      body: formData,
      headers
    })
  }
}

// Specific API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', {
    ...credentials,
    userType: 'dealer'
  }),

  logout: () => {
    localStorage.removeItem('dealerLogin')
    return Promise.resolve()
  },

  refreshToken: () => api.post('/api/auth/refresh'),

  resetPassword: (email) => api.post('/api/auth/reset-password', { email }),

  validateToken: () => api.get('/api/auth/validate')
}

export const productsAPI = {
  getAll: (params = {}) => api.get('/api/product/products', {
    fields: 'id,sku,name,shortDescription,image,price',
    ...params
  }),

  getById: (id) => api.get(`/api/product/${id}`),

  getBasicInfo: (id, fields = 'name,image') => api.get(`/api/product/${id}?fields=${fields}`),

  getAvailableCount: (id) => api.get(`/api/product/${id}/available-count`),

  getSerials: (productId, status = 'SOLD_TO_DEALER') => {
    return api.get(`/api/product/${productId}/serials/status/${status}`)
  },

  search: (query, filters = {}) => api.get('/api/products/search', {
    q: query,
    ...filters
  }),

  getCategories: () => api.get('/api/products/categories'),

  getBrands: () => api.get('/api/products/brands')
}

export const ordersAPI = {
  getAll: (params = {}) => api.get('/api/order/orders', params),

  getById: (id) => api.get(`/api/order/orders/${id}`),

  create: (orderData) => {
    console.log('🔥 ordersAPI.create called with:', orderData)
    return api.post('/api/order/orders', orderData)
  },

  update: (id, orderData) => api.put(`/api/orders/${id}`, orderData),

  cancel: (id, reason) => api.patch(`/api/orders/${id}/cancel`, { reason }),

  getStatus: (id) => api.get(`/api/orders/${id}/status`)
}

export const warrantyAPI = {
  register: (warrantyData) => api.post('/api/warranty', warrantyData),
  
  getById: (id) => api.get(`/api/warranty/${id}`),
  
  search: (query) => api.get('/api/warranty/search', { q: query }),
  
  uploadDocument: (id, file) => {
    const formData = new FormData()
    formData.append('document', file)
    return api.upload(`/api/warranty/${id}/document`, formData)
  }
}

export const cartAPI = {
  add: (dealerId, productId, quantity, unitPrice) => {
    console.log('🔥 cartAPI.add called with:', { dealerId, productId, quantity, unitPrice })
    return api.post('/api/cart/add', {
      dealerId,
      productId,
      quantity,
      unitPrice
    })
  },

  getAll: (dealerId) => api.get(`/api/cart/dealer/${dealerId}`),

  increment: (dealerId, productId, unitPrice, increment = 1) => {
    console.log('🔥 cartAPI.increment called with:', { dealerId, productId, unitPrice, increment })
    return api.patch(`/api/cart/dealer/${dealerId}/product/${productId}/increment?unitPrice=${unitPrice}&increment=${increment}`)
  },

  decrement: (dealerId, productId, unitPrice, decrement = 1) => {
    console.log('🔥 cartAPI.decrement called with:', { dealerId, productId, unitPrice, decrement })
    return api.patch(`/api/cart/dealer/${dealerId}/product/${productId}/decrement?unitPrice=${unitPrice}&decrement=${decrement}`)
  },

  // New PATCH quantity endpoints
  updateQuantity: {
    increment: (cartId) => {
      console.log('🔥 cartAPI.updateQuantity.increment called with cartId:', cartId)
      return api.patch(`/api/cart/item/${cartId}/quantity?action=increment`)
    },

    decrement: (cartId) => {
      console.log('🔥 cartAPI.updateQuantity.decrement called with cartId:', cartId)
      return api.patch(`/api/cart/item/${cartId}/quantity?action=decrement`)
    },

    set: (cartId, quantity) => {
      console.log('🔥 cartAPI.updateQuantity.set called with:', { cartId, quantity })
      return api.patch(`/api/cart/item/${cartId}/quantity?action=set&quantity=${quantity}`)
    }
  },

  remove: (cartId) => {
    console.log('🔥 cartAPI.remove called with cartId:', cartId)
    return api.delete(`/api/cart/item/${cartId}`)
  },

  clear: (dealerId) => api.delete(`/api/cart/dealer/${dealerId}`)
}

export const dealerAPI = {
  getProfile: () => api.get('/api/dealer/profile'),

  updateProfile: (profileData) => api.patch('/api/dealer/profile', profileData),

  getStats: () => api.get('/api/dealer/stats'),

  getOrders: (params = {}) => api.get('/api/dealer/orders', params),

  getSales: (params = {}) => api.get('/api/dealer/sales', params)
}

export const customerAPI = {
  checkExists: (emailOrPhone) => api.get(`/api/user/customers/${encodeURIComponent(emailOrPhone)}/check-exists`)
}

// Error handler utility for components
export const handleAPIError = (error, showNotification = true) => {
  console.error('API Error:', error)
  
  // Default error messages
  const defaultMessages = {
    NetworkError: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
    AuthenticationError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    AuthorizationError: 'Bạn không có quyền thực hiện tác vụ này.',
    ValidationError: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
    NotFoundError: 'Không tìm thấy tài nguyên được yêu cầu.',
    ServerError: 'Lỗi server. Vui lòng thử lại sau.',
    APIError: 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }

  const userMessage = error.message || defaultMessages[error.name] || defaultMessages.APIError

  if (showNotification) {
    // You can integrate with your notification system here
    console.error('User message:', userMessage)
  }

  return {
    message: userMessage,
    type: error.name,
    status: error.status,
    code: error.code
  }
}

// Request interceptor for debugging (development only)
if (process.env.NODE_ENV === 'development') {
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
  }
}

export default api