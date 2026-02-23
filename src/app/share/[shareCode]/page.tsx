'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ResumeTemplate } from '@/components/ResumeTemplate'
import { parseResumeText, ResumeData, TemplateType } from '@/lib/templates'
import { getSharedResumeByCode, SharedResume } from '@/lib/share'

export default function SharePage() {
  const params = useParams()
  const shareCode = params.shareCode as string
  const [sharedResume, setSharedResume] = useState<SharedResume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSharedResume = () => {
      const shared = getSharedResumeByCode(shareCode)
      if (shared) {
        setSharedResume(shared)
      } else {
        setError('简历不存在或已过期')
      }
      setIsLoading(false)
    }

    loadSharedResume()
  }, [shareCode])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !sharedResume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{error || '简历不存在'}</h1>
          <p className="text-gray-600 mb-4">该分享链接可能已过期或被删除</p>
          <Link href="/" className="text-blue-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const resumeData: ResumeData = parseResumeText(sharedResume.content)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold gradient-text">
            AI简历助手
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              浏览次数: {sharedResume.viewCount}
            </span>
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700"
            >
              创建我的简历
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h1 className="text-xl font-bold">{sharedResume.title}</h1>
          </div>
          <div className="overflow-auto">
            <ResumeTemplate data={resumeData} template={sharedResume.template as TemplateType} />
          </div>
        </div>
      </main>
    </div>
  )
}
