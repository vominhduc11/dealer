import { useState } from 'react'
import PropTypes from 'prop-types'
import { authAPI, handleAPIError } from '../services/api'
import { Modal } from './UI'
import { Music, Lock, User, AlertCircle, LogIn, Info } from 'lucide-react'

const LoginModal = ({ isOpen, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password
      })

      onLogin(response.data)
      setFormData({ username: '', password: '', rememberMe: false })
    } catch (error) {
      const errorInfo = handleAPIError(error, false)
      setError(errorInfo.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      {/* Logo & Title Section */}
      <div className="text-center mb-8 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 mb-4 shadow-lg">
          <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent mb-2">
          TuneZone Dealer
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
          Đăng nhập để truy cập hệ thống quản lý
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
        {/* Username Field */}
        <div className="group">
          <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Tên đăng nhập
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập của bạn"
              required
              disabled={isLoading}
              autoComplete="username"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="group">
          <label className="block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu của bạn"
              required
              disabled={isLoading}
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium select-none">
              Ghi nhớ đăng nhập
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(!showForgotPassword)}
            disabled={isLoading}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Forgot Password Help */}
        {showForgotPassword && (
          <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-slide-down">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium m-0">
                Vui lòng liên hệ quản trị viên để được hỗ trợ khôi phục mật khẩu.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium m-0">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Đăng nhập</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs sm:text-sm text-center text-slate-500 dark:text-slate-400">
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <span className="text-primary-600 dark:text-primary-400 font-semibold">
            Điều khoản dịch vụ
          </span>{' '}
          của chúng tôi
        </p>
      </div>

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 200px;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out 0.1s both;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </Modal>
  )
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default LoginModal
