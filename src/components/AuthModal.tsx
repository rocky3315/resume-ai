'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const result = await login(email, password)
        if (result.success) {
          onClose()
          resetForm()
        } else {
          setError(result.error || '登录失败')
        }
      } else {
        if (!name.trim()) {
          setError('请输入姓名')
          setIsLoading(false)
          return
        }
        const result = await register(email, name, password)
        if (result.success) {
          onClose()
          resetForm()
        } else {
          setError(result.error || '注册失败')
        }
      }
    } catch {
      setError('发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setName('')
    setPassword('')
    setError('')
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? '登录' : '注册'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入姓名"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入邮箱"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入密码"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              还没有账号？
              <button onClick={switchMode} className="text-blue-600 hover:underline ml-1">
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账号？
              <button onClick={switchMode} className="text-blue-600 hover:underline ml-1">
                立即登录
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
