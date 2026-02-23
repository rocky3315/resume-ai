'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { InterviewMessage, InterviewSession, InterviewFeedback } from '@/lib/interview'

const INTERVIEWER_SYSTEM_PROMPT = `你是一位专业的面试官，正在对候选人进行模拟面试。

候选人简历：
{resume}

目标岗位：{targetJob}

面试规则：
1. 每次只问一个问题
2. 根据候选人回答进行追问或进入下一个话题
3. 问题类型包括：技术问题、项目经验、行为面试、情景问题
4. 保持专业友好的态度
5. 在候选人回答后给予简短反馈
6. 面试共进行5-8个问题，然后给出综合评价

面试开始时，先简单自我介绍，然后请候选人自我介绍。`

export default function InterviewPage() {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(true)
  const [resumeContent, setResumeContent] = useState('')
  const [targetJob, setTargetJob] = useState('')
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [session?.questions])

  const startInterview = async () => {
    if (!resumeContent.trim() || !targetJob.trim()) {
      alert('请填写简历内容和目标岗位')
      return
    }

    setIsLoading(true)
    setShowSetup(false)

    const newSession: InterviewSession = {
      id: Date.now().toString(36),
      resumeContent,
      targetJob,
      questions: [],
      status: 'active',
      createdAt: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'interview',
          resume: resumeContent,
          targetJob,
          messages: []
        })
      })

      const data = await response.json()
      
      if (data.success) {
        newSession.questions.push({
          id: Date.now().toString(36),
          role: 'interviewer',
          content: data.message,
          timestamp: new Date().toISOString()
        })
        setSession(newSession)
      }
    } catch {
      alert('启动面试失败，请重试')
      setShowSetup(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !session) return

    const userMessage = input.trim()
    setInput('')
    
    const newQuestion: InterviewMessage = {
      id: Date.now().toString(36),
      role: 'candidate',
      content: userMessage,
      timestamp: new Date().toISOString()
    }

    setSession(prev => prev ? {
      ...prev,
      questions: [...prev.questions, newQuestion]
    } : null)

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'interview',
          resume: session.resumeContent,
          targetJob: session.targetJob,
          messages: [...session.questions, newQuestion].map(q => ({
            role: q.role === 'interviewer' ? 'assistant' : 'user',
            content: q.content
          }))
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const interviewerMessage: InterviewMessage = {
          id: Date.now().toString(36),
          role: 'interviewer',
          content: data.message,
          timestamp: new Date().toISOString()
        }

        setSession(prev => prev ? {
          ...prev,
          questions: [...prev.questions, interviewerMessage]
        } : null)

        if (data.completed) {
          setFeedback(data.feedback)
        }
      }
    } catch {
      alert('发送失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const endInterview = () => {
    if (session) {
      setSession(prev => prev ? { ...prev, status: 'completed' } : null)
    }
  }

  if (showSetup) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold gradient-text">
              AI简历助手
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-gray-900">
              返回聊天
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-medium p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">AI模拟面试</h1>
              <p className="text-gray-600">根据您的简历进行模拟面试练习</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标岗位</label>
                <input
                  type="text"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：前端开发工程师"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">简历内容</label>
                <textarea
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none"
                  placeholder="粘贴您的简历内容..."
                />
              </div>

              <button
                onClick={startInterview}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50"
              >
                {isLoading ? '准备中...' : '开始面试'}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold gradient-text">
            AI简历助手
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">目标岗位：{session?.targetJob}</span>
            {session?.status === 'active' && (
              <button
                onClick={endInterview}
                className="px-4 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                结束面试
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {session?.questions.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {message.role === 'interviewer' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                  面试官
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'candidate'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-medium'
                    : 'bg-white text-gray-900 shadow-soft border border-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              </div>
              {message.role === 'candidate' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm ml-2 flex-shrink-0">
                  我
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                面试官
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-soft border border-gray-100">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {feedback && (
          <div className="p-4 border-t bg-white/80 backdrop-blur-md">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">面试反馈</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-green-600">{feedback.overallScore}/100</div>
                <div className="text-gray-600">综合评分</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">表现亮点</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">改进建议</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {feedback.improvements.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{feedback.detailedFeedback}</p>
            </div>
          </div>
        )}

        {session?.status === 'active' && !feedback && (
          <div className="border-t bg-white/80 backdrop-blur-md p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入您的回答..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white shadow-soft"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`px-6 py-3 rounded-xl transition-all font-medium ${
                    isLoading || !input.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-medium hover:shadow-large'
                  }`}
                >
                  发送
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
