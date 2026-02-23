'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, useEffect, useRef } from 'react'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  className,
  children,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-hidden animate-scale-in',
          sizes[size],
          className
        )}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: 'blue' | 'green' | 'purple' | 'orange'
}

export function ModalHeader({ gradient = 'blue', className, children, ...props }: ModalHeaderProps) {
  const gradients = {
    blue: 'from-blue-600 to-indigo-600',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-indigo-600',
    orange: 'from-orange-600 to-red-600'
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-r p-6 text-white',
        gradients[gradient],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
