'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TemplateType } from '@/lib/templates'
import { Button, Input } from '@/components/ui'

interface SaveResumeModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  template: TemplateType
  editId?: string
  editTitle?: string
}

export function SaveResumeModal({ isOpen, onClose, content, template, editId, editTitle }: SaveResumeModalProps) {
  const [title, setTitle] = useState(editTitle || '')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { saveResume, updateResumeData } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setTitle(editTitle || '')
      setError('')
    }
  }, [isOpen, editTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('请输入简历标题')
      return
    }

    setIsLoading(true)

    try {
      if (editId) {
        const result = await updateResumeData(editId, title.trim(), content, template)
        if (result) {
          onClose()
        } else {
          setError('保存失败')
        }
      } else {
        const result = await saveResume(title.trim(), content, template)
        if (result) {
          onClose()
        } else {
          setError('保存失败，请先登录')
        }
      }
    } catch {
      setError('发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? '更新简历' : '保存简历'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="简历标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：前端开发工程师简历"
            error={error}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              保存
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
