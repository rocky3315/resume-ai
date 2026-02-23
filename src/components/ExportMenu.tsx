'use client'

import { useState, useRef, useEffect } from 'react'
import { ResumeData } from '@/lib/templates'
import { exportToMarkdown, exportToWord, exportToHTML, exportToJSON } from '@/lib/export'

interface ExportMenuProps {
  resumeText: string
  resumeData: ResumeData
  templateName: string
  onExportPDF: () => void
  isExporting: boolean
}

export function ExportMenu({ resumeText, resumeData, templateName, onExportPDF, isExporting }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = (type: 'pdf' | 'word' | 'markdown' | 'html' | 'json') => {
    switch (type) {
      case 'pdf':
        onExportPDF()
        break
      case 'word':
        exportToWord(resumeData, templateName)
        break
      case 'markdown':
        exportToMarkdown(resumeText)
        break
      case 'html':
        exportToHTML(resumeData, templateName)
        break
      case 'json':
        exportToJSON(resumeData)
        break
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium disabled:opacity-50 flex items-center gap-1"
      >
        {isExporting ? '导出中...' : '导出'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-scale-in">
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">PDF</span>
            <div>
              <div className="font-medium">PDF 文档</div>
              <div className="text-xs text-gray-400">适合打印和分享</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('word')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">DOC</span>
            <div>
              <div className="font-medium">Word 文档</div>
              <div className="text-xs text-gray-400">可继续编辑</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('html')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-bold">HTML</span>
            <div>
              <div className="font-medium">HTML 页面</div>
              <div className="text-xs text-gray-400">网页格式</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('markdown')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-xs font-bold">MD</span>
            <div>
              <div className="font-medium">Markdown</div>
              <div className="text-xs text-gray-400">纯文本格式</div>
            </div>
          </button>
          
          <button
            onClick={() => handleExport('json')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-bold">JSON</span>
            <div>
              <div className="font-medium">JSON 数据</div>
              <div className="text-xs text-gray-400">结构化数据</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
