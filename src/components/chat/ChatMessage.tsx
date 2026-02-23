import { cn } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  avatar?: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, avatar, isLoading }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex animate-fade-in',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {role === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
          {avatar || 'AI'}
        </div>
      )}
      
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          role === 'user'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-medium'
            : 'bg-white text-gray-900 shadow-soft border border-gray-100'
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
        )}
      </div>
      
      {role === 'user' && (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm ml-2 flex-shrink-0">
          {avatar || 'U'}
        </div>
      )}
    </div>
  )
}
