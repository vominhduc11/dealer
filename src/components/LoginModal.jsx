import { useState } from 'react'
import PropTypes from 'prop-types'
import { authAPI, handleAPIError } from '../services/api'
import { Modal, Input, Button } from './UI'

const LoginModal = ({ isOpen, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
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
      setFormData({ username: '', password: '' })
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
      onClose={() => {}} // Prevent closing
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="text-center mb-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30 -m-6 mb-6 p-8 pb-6 border-b border-primary-200/50 dark:border-primary-700/50">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            🎵 TuneZone Dealer
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Đăng nhập để truy cập hệ thống
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên đăng nhập"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Nhập tên đăng nhập"
          required
          disabled={isLoading}
          autoComplete="username"
        />

        <Input
          label="Mật khẩu"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Nhập mật khẩu"
          required
          disabled={isLoading}
          autoComplete="current-password"
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-center border border-red-200 dark:border-red-800 text-sm font-medium">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : '🔐 Đăng nhập'}
        </Button>
      </form>
    </Modal>
  )
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default LoginModal