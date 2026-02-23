'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SavedResume } from '@/lib/auth'
import { templates } from '@/lib/templates'

interface ResumeListProps {
  onSelectResume: (resume: SavedResume) => void
  selectedId?: string
}

export function ResumeList({ onSelectResume, selectedId }: ResumeListProps) {
  const { resumes, deleteResumeById, user } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('确定要删除这份简历吗？')) {
      setDeletingId(id)
      await deleteResumeById(id)
      setDeletingId(null)
    }
  }

  const getTemplateName = (templateId: string) => {
    return templates.find(t => t.id === templateId)?.name || templateId
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        请先登录以查看保存的简历
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        暂无保存的简历
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          onClick={() => onSelectResume(resume)}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            selectedId === resume.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{resume.title}</h3>
              <div className="flex gap-2 mt-1 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {getTemplateName(resume.template)}
                </span>
                <span>{formatDate(resume.updatedAt)}</span>
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(e, resume.id)}
              disabled={deletingId === resume.id}
              className="text-gray-400 hover:text-red-500 text-sm disabled:opacity-50"
            >
              {deletingId === resume.id ? '删除中...' : '删除'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
