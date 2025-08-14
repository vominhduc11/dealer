import { useNavigate } from 'react-router-dom'

const Cart = ({ cart, onUpdateItem, onRemoveItem, onCheckout, totalAmount }) => {
  const navigate = useNavigate()
  const VAT_RATE = 0.1

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const calculateVAT = (amount) => amount * VAT_RATE
  const calculateTotal = (amount) => amount + calculateVAT(amount)

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateItem(productId, newQuantity)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="pt-[70px] xl:pt-[80px] 2xl:pt-[90px] 3xl:pt-[100px] 4xl:pt-[120px] 5xl:pt-[140px] pb-20 md:pb-5 max-w-screen-5xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <button 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-300 flex items-center gap-2"
            onClick={() => navigate('/products')}
          >
            📱 Xem sản phẩm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[70px] xl:pt-[80px] 2xl:pt-[90px] 3xl:pt-[100px] 4xl:pt-[120px] 5xl:pt-[140px] pb-20 md:pb-5 max-w-screen-5xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Giỏ hàng ({cart.length} sản phẩm)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full sm:w-24 h-32 sm:h-24 object-contain rounded-lg bg-slate-50 dark:bg-slate-700"
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {item.description}
                  </p>
                  <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(item.price)}
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex flex-col items-end gap-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    onClick={() => onRemoveItem(item.id)}
                    title="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Tóm tắt đơn hàng
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600 dark:text-green-400">Miễn phí</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>VAT ({Math.round(VAT_RATE * 100)}%):</span>
                <span>{formatPrice(calculateVAT(totalAmount))}</span>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(calculateTotal(totalAmount))}</span>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={onCheckout}
            >
              💳 Tiến hành thanh toán
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Lưu ý:</strong> Giá đã bao gồm VAT và phí vận chuyển miễn phí
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart