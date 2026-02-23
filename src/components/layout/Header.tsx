'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ReactNode, useState } from 'react'

interface HeaderProps {
  children?: ReactNode
  className?: string
  showNav?: boolean
}

export function Header({ children, className, showNav = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={cn('border-b bg-white/80 backdrop-blur-md sticky top-0 z-10', className)}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold gradient-text">
          AI简历助手
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          {children}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            {children}
          </div>
        </div>
      )}
    </nav>
  )
}

interface HeaderNavProps {
  children?: ReactNode
  className?: string
}

export function HeaderNav({ children, className }: HeaderNavProps) {
  return (
    <div className={cn('flex flex-col md:flex-row gap-2 md:items-center', className)}>
      {children}
    </div>
  )
}

interface HeaderLinkProps {
  href: string
  children: ReactNode
  variant?: 'default' | 'primary'
  className?: string
}

export function HeaderLink({ href, children, variant = 'default', className }: HeaderLinkProps) {
  if (variant === 'primary') {
    return (
      <Link
        href={href}
        className={cn(
          "px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium text-center",
          className
        )}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium",
        className
      )}
    >
      {children}
    </Link>
  )
}
