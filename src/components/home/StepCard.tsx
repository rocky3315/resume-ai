import { cn } from '@/lib/utils'

interface StepCardProps {
  step: number
  title: string
  description: string
  showConnector?: boolean
}

export function StepCard({ step, title, description, showConnector = true }: StepCardProps) {
  return (
    <div className="relative">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-sm text-center">{description}</p>
      {showConnector && (
        <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent -translate-x-6" />
      )}
    </div>
  )
}
