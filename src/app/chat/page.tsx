'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是AI简历助手。我可以帮你生成和优化专业简历。\n\n请告诉我：\n1. 你想生成新简历，还是优化现有简历？\n2. 你的目标岗位是什么？'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          resume
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
        if (data.resume) {
          setResume(data.resume)
        }
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '抱歉，出现了一些问题。请稍后再试。' 
        }])
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '网络错误，请检查网络连接后重试。' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyResume = () => {
    if (resume) {
      navigator.clipboard.writeText(resume)
      alert('简历已复制到剪贴板！')
    }
  }

  const handleExportPDF = async () => {
    if (!resume) return
    
    setIsExporting(true)
    setShowPreview(true)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      if (resumeRef.current) {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 10
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save('我的简历.pdf')
      }
    } catch (error) {
      console.error('PDF导出失败:', error)
      alert('PDF导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  const parseResumeToHTML = (resumeText: string) => {
    const lines = resumeText.split('\n').filter(line => line.trim())
    let html = ''
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('【') && trimmedLine.endsWith('】')) {
        const title = trimmedLine.replace(/【|】/g, '')
        html += `<h2 class="text-lg font-bold text-gray-900 border-b pb-2 mb-3 mt-6 first:mt-0">${title}</h2>`
      } else if (trimmedLine.startsWith('电话') || trimmedLine.startsWith('邮箱')) {
        html += `<p class="text-gray-600 text-sm">${trimmedLine}</p>`
      } else if (trimmedLine.includes('：') && !trimmedLine.startsWith('-')) {
        const parts = trimmedLine.split('：')
        html += `<p class="text-gray-800 mb-2"><span class="font-semibold">${parts[0]}：</span>${parts.slice(1).join('：')}</p>`
      } else if (trimmedLine.startsWith('-')) {
        html += `<p class="text-gray-700 text-sm pl-4 mb-1">${trimmedLine}</p>`
      } else if (trimmedLine) {
        html += `<p class="text-gray-800 mb-2">${trimmedLine}</p>`
      }
    })
    
    return html
  }

  const isButtonDisabled = isLoading || input.trim().length === 0

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            AI简历助手
          </Link>
          <div className="flex gap-2">
            {resume && (
              <>
                <button
                  onClick={handleCopyResume}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  复制简历
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                >
                  {isExporting ? '导出中...' : '导出PDF'}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                }}
                placeholder="输入你的回答..."
                className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`px-6 py-3 rounded-xl transition-colors ${
                  isButtonDisabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                发送
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPreview && resume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">简历预览</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div ref={resumeRef} className="p-8 bg-white">
              <div dangerouslySetInnerHTML={{ __html: parseResumeToHTML(resume) }} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
