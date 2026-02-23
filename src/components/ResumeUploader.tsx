'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui'

interface ResumeUploaderProps {
  onUploadSuccess: (text: string, fileName: string) => void
  disabled?: boolean
}

export function ResumeUploader({ onUploadSuccess, disabled }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        showToast(`已解析简历：${data.fileName}（${data.charCount}字）`, 'success')
        onUploadSuccess(data.text, data.fileName)
      } else {
        showToast(data.error || '文件解析失败', 'error')
      }
    } catch (error) {
      showToast('上传失败，请重试', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div
      className={`relative ${isDragging ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        className="gap-1"
      >
        {isUploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            解析中
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            上传简历
          </>
        )}
      </Button>
      
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
          <span className="text-blue-600 font-medium">释放文件以上传</span>
        </div>
      )}
    </div>
  )
}
