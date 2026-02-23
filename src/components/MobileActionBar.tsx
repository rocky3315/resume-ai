'use client'

import { Button } from '@/components/ui'

interface MobileActionBarProps {
  onScore: () => void
  onDiagnose: () => void
  onTemplate: () => void
  onTargetJob: () => void
  onShare: () => void
  onSave: () => void
  targetJob?: string
  templateName: string
  isLoading?: boolean
}

export function MobileActionBar({
  onScore,
  onDiagnose,
  onTemplate,
  onTargetJob,
  onShare,
  onSave,
  targetJob,
  templateName,
  isLoading
}: MobileActionBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
      <div className="flex justify-around items-center p-2 overflow-x-auto">
        <button
          onClick={onTargetJob}
          className="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">{targetJob || '岗位'}</span>
        </button>

        <button
          onClick={onScore}
          disabled={isLoading}
          className="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 hover:text-blue-600 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs">评分</span>
        </button>

        <button
          onClick={onDiagnose}
          disabled={isLoading}
          className="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 hover:text-blue-600 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-xs">诊断</span>
        </button>

        <button
          onClick={onTemplate}
          className="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span className="text-xs">模板</span>
        </button>

        <button
          onClick={onShare}
          className="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-xs">分享</span>
        </button>

        <button
          onClick={onSave}
          className="flex flex-col items-center gap-1 px-3 py-1 text-green-600 hover:text-green-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span className="text-xs">保存</span>
        </button>
      </div>
    </div>
  )
}
