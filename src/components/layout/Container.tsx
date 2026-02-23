import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl'
    }

    return (
      <div
        ref={ref}
        className={cn('mx-auto px-4', sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'
