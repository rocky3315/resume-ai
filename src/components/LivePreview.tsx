'use client'

import { useState, useRef } from 'react'
import { ResumeData, TemplateType } from '@/lib/templates'
import { ResumeTemplate } from '@/components/ResumeTemplate'

interface LivePreviewProps {
  resumeData: ResumeData
  selectedTemplate: TemplateType
  className?: string
}

export function LivePreview({ resumeData, selectedTemplate, className }: LivePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  const hasContent = () => {
    return (
      resumeData.name ||
      resumeData.summary ||
      resumeData.education.length > 0 ||
      resumeData.experience.length > 0 ||
      resumeData.projects.length > 0 ||
      resumeData.skills.length > 0
    )
  }

  if (!hasContent()) {
    return (
      <div className={`h-full ${className || ''} bg-white border-r border-gray-200 shadow-soft overflow-hidden`}>
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-center text-sm">暂无简历内容</p>
          <p className="text-center text-xs text-gray-300 mt-1">开始生成简历后，这里将显示预览</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full ${className || ''} bg-white border-r border-gray-200 shadow-soft overflow-hidden flex flex-col`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-medium text-gray-600">实时预览</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title={isExpanded ? '收起' : '展开'}
        >
          {isExpanded ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
      </div>
      
      <div 
        ref={resumeRef}
        className="flex-1 overflow-auto bg-gray-100 p-4"
      >
        <div className={`transform origin-top-left transition-transform duration-300 ${isExpanded ? 'scale-100' : 'scale-50'}`}>
          <ResumeTemplate data={resumeData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  )
}
