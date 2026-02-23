'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui'

interface ChatInputProps {
  onSubmit: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
  showQuickActions?: boolean
}

const quickActions = [
  { label: '生成简历', prompt: '请帮我生成一份简历' },
  { label: '优化简历', prompt: '请帮我优化这份简历' },
  { label: '添加经历', prompt: '我想添加一段工作经历' },
  { label: '修改技能', prompt: '我想修改专业技能部分' },
]

export function ChatInput({ 
  onSubmit, 
  isLoading = false, 
  placeholder = '输入你的回答...', 
  disabled = false,
  showQuickActions = true
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const [showActions, setShowActions] = useState(true)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || disabled) return
    
    onSubmit(input.trim())
    setInput('')
    setShowActions(false)
  }

  const handleQuickAction = (prompt: string) => {
    onSubmit(prompt)
    setShowActions(false)
  }

  const isButtonDisabled = isLoading || disabled || input.trim().length === 0

  return (
    <div className="w-full space-y-3">
      {/* Quick Actions */}
      {showQuickActions && showActions && !isLoading && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 py-1">快捷操作：</span>
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowActions(true)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white shadow-soft"
            disabled={isLoading || disabled}
          />
          <Button
            type="submit"
            disabled={isButtonDisabled}
            isLoading={isLoading}
            size="lg"
          >
            发送
          </Button>
        </div>
      </form>
    </div>
  )
}
