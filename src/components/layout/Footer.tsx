import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FooterProps {
  className?: string
  children?: ReactNode
}

export function Footer({ className, children }: FooterProps) {
  return (
    <footer className={cn('border-t bg-white/50 mt-12', className)}>
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        {children || <p>© 2024 AI简历助手. 用AI技术助力求职者.</p>}
      </div>
    </footer>
  )
}
