import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
  className?: string
  animationDelay?: number
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  iconColor = 'blue',
  className,
  animationDelay = 0
}: FeatureCardProps) {
  const iconColors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    orange: 'from-orange-500 to-red-600',
    pink: 'from-pink-500 to-rose-600',
    indigo: 'from-indigo-500 to-blue-600'
  }

  return (
    <div 
      className={cn(
        'group p-8 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 animate-slide-up',
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={cn(
        'w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform',
        iconColors[iconColor]
      )}>
        <span className="w-7 h-7 text-white">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
