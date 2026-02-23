'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { TemplateSelector } from '@/components/TemplateSelector'
import { ResumeTemplate } from '@/components/ResumeTemplate'
import { AuthModal } from '@/components/AuthModal'
import { SaveResumeModal } from '@/components/SaveResumeModal'
import { ResumeList } from '@/components/ResumeList'
import { ExportMenu } from '@/components/ExportMenu'
import { ResumeScoreCard } from '@/components/ResumeScoreCard'
import { ResumeDiagnosisCard } from '@/components/ResumeDiagnosisCard'
import { ResumeUploader } from '@/components/ResumeUploader'
import { ResumeParser } from '@/components/ResumeParser'
import { MobileActionBar } from '@/components/MobileActionBar'
import { ChatMessage, ChatInput } from '@/components/chat'
import { EditableResumePreview } from '@/components/EditableResumePreview'
import { Header, HeaderNav } from '@/components/layout'
import { Button, Modal, Input, useToast } from '@/components/ui'
import { useModal, useLoading } from '@/hooks'
import { parseResumeText, TemplateType, ResumeData, templates } from '@/lib/templates'
import { useAuth } from '@/contexts/AuthContext'
import { SavedResume } from '@/lib/auth'
import { ResumeScore } from '@/lib/scoring'
import { DiagnosisResult } from '@/lib/diagnosis'
import { createShareLink, getShareUrl } from '@/lib/share'

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
  const [resume, setResume] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern')
  const [editingResume, setEditingResume] = useState<SavedResume | null>(null)
  const [resumeScore, setResumeScore] = useState<ResumeScore | null>(null)
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null)
  const [targetJob, setTargetJob] = useState('')
  const [rawResumeText, setRawResumeText] = useState('')
  const [showParser, setShowParser] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  const { user, logout, updateResumeData } = useAuth()
  const { showToast } = useToast()
  
  const authModal = useModal()
  const saveModal = useModal()
  const resumeListModal = useModal()
  const templateSelectorModal = useModal()
  const targetJobModal = useModal()
  const scoreCardModal = useModal()
  const shareModal = useModal()
  const previewModal = useModal()
  const diagnosisModal = useModal()
  
  const chatLoading = useLoading()
  const scoringLoading = useLoading()
  const diagnosisLoading = useLoading()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }])
    
    await chatLoading.withLoading(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: message }],
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
          showToast('抱歉，出现了一些问题。请稍后再试。', 'error')
        }
      } catch {
        showToast('网络错误，请检查网络连接后重试。', 'error')
      }
    })
  }

  const handleCopyResume = () => {
    if (resume) {
      navigator.clipboard.writeText(resume)
      showToast('简历已复制到剪贴板！', 'success')
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
        showToast('PDF导出成功！', 'success')
      }
    } catch (error) {
      console.error('PDF导出失败:', error)
      showToast('PDF导出失败，请重试', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveResume = async () => {
    if (!user) {
      authModal.open()
      return
    }
    
    if (editingResume) {
      const result = await updateResumeData(
        editingResume.id, 
        editingResume.title, 
        resume, 
        selectedTemplate
      )
      if (result) {
        showToast('简历已更新', 'success')
        setEditingResume(result)
      } else {
        showToast('更新失败，请重试', 'error')
      }
    } else {
      saveModal.open()
    }
  }

  const handleScoreResume = async () => {
    if (!resume) return
    
    await scoringLoading.withLoading(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'score',
            resume,
            targetJob: targetJob || '通用岗位'
          })
        })

        const data = await response.json()
        
        if (data.success && data.score) {
          setResumeScore(data.score)
          scoreCardModal.open()
        } else {
          showToast('评分失败，请重试', 'error')
        }
      } catch {
        showToast('网络错误，请重试', 'error')
      }
    })
  }

  const handleDiagnoseResume = async () => {
    if (!resume) return
    
    await diagnosisLoading.withLoading(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'diagnose',
            resume,
            targetJob: targetJob || '通用岗位'
          })
        })

        const data = await response.json()
        
        if (data.success && data.diagnosis) {
          setDiagnosisResult(data.diagnosis)
          diagnosisModal.open()
        } else {
          showToast('诊断失败，请重试', 'error')
        }
      } catch {
        showToast('网络错误，请重试', 'error')
      }
    })
  }

  const handleShareResume = () => {
    if (!resume || !user) {
      if (!user) {
        authModal.open()
      }
      return
    }
    
    const shared = createShareLink(
      editingResume?.id || Date.now().toString(36),
      user.id,
      editingResume?.title || '我的简历',
      resume,
      selectedTemplate
    )
    
    const url = getShareUrl(shared.shareCode)
    navigator.clipboard.writeText(url)
    showToast('分享链接已复制到剪贴板！', 'success')
  }

  const handleSelectSavedResume = (savedResume: SavedResume) => {
    setResume(savedResume.content)
    setSelectedTemplate(savedResume.template as TemplateType)
    setEditingResume(savedResume)
    resumeListModal.close()
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `已加载简历「${savedResume.title}」，你可以继续编辑或优化它。` 
    }])
  }

  const handleUploadResume = async (text: string, fileName: string) => {
    setRawResumeText(text)
    setShowParser(true)
    setMessages(prev => [...prev, 
      { 
        role: 'user', 
        content: `我上传了一份简历文件：${fileName}` 
      },
      { 
        role: 'assistant', 
        content: `已读取文件内容（${text.length} 字符）。

接下来我会分步骤帮您解析简历，请确认或修改每一项内容。` 
      }
    ])
  }

  const handleParserComplete = (data: ResumeData) => {
    const formattedResume = generateResumeText(data)
    setResume(formattedResume)
    setShowParser(false)
    setEditingResume(null)
    
    setMessages(prev => [...prev, 
      { 
        role: 'assistant', 
        content: `✅ 简历解析完成！

**解析结果：**
- 姓名：${data.name || '未填写'}
- 电话：${data.phone || '未填写'}
- 邮箱：${data.email || '未填写'}
- 教育经历：${data.education?.length || 0} 条
- 工作经历：${data.experience?.length || 0} 条
- 项目经验：${data.projects?.length || 0} 条
- 专业技能：${data.skills?.length || 0} 项

您可以：
1. 点击「预览编辑」查看和修改简历
2. 告诉我您的目标岗位，我来优化简历内容
3. 点击「诊断」查看简历问题` 
      }
    ])
  }

  const handleParserCancel = () => {
    setShowParser(false)
    setMessages(prev => [...prev, 
      { 
        role: 'assistant', 
        content: `已取消解析。您可以：
1. 重新上传简历文件
2. 直接告诉我您的信息，我来帮您生成简历` 
      }
    ])
  }

  const handleNewResume = () => {
    setResume('')
    setEditingResume(null)
    setMessages([
      {
        role: 'assistant',
        content: '你好！我是AI简历助手。我可以帮你生成和优化专业简历。\n\n请告诉我：\n1. 你想生成新简历，还是优化现有简历？\n2. 你的目标岗位是什么？'
      }
    ])
    resumeListModal.close()
  }

  const handleEditResumeData = (newData: ResumeData) => {
    const resumeText = generateResumeText(newData)
    setResume(resumeText)
  }

  const generateResumeText = (data: ResumeData): string => {
    let text = `${data.name}\n`
    if (data.phone) text += `电话：${data.phone}\n`
    if (data.email) text += `邮箱：${data.email}\n`
    
    if (data.summary) {
      text += `\n【个人简介】\n${data.summary}\n`
    }
    
    if (data.education.length > 0) {
      text += `\n【教育背景】\n`
      data.education.forEach(edu => {
        text += `${edu.school} | ${edu.major} | ${edu.degree} | ${edu.time}\n`
      })
    }
    
    if (data.experience.length > 0) {
      text += `\n【工作经历】\n`
      data.experience.forEach(exp => {
        text += `${exp.company} | ${exp.position} | ${exp.time}\n`
        exp.achievements.forEach(ach => {
          text += `- ${ach}\n`
        })
      })
    }
    
    if (data.projects.length > 0) {
      text += `\n【项目经验】\n`
      data.projects.forEach(proj => {
        text += `${proj.name} | ${proj.role} | ${proj.time}\n`
        text += `- ${proj.description}\n`
      })
    }
    
    if (data.skills.length > 0) {
      text += `\n【专业技能】\n${data.skills.join('、')}\n`
    }
    
    return text
  }

  const parsedResumeData: ResumeData = resume ? parseResumeText(resume) : {
    name: '',
    education: [],
    experience: [],
    projects: [],
    skills: []
  }

  const currentTemplateName = templates.find(t => t.id === selectedTemplate)?.name || '现代风格'

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header>
        <HeaderNav>
          {/* Mobile: Show only essential buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <ResumeUploader onUploadSuccess={handleUploadResume} disabled={chatLoading.isLoading} />
            {resume && (
              <Button variant="primary" size="sm" onClick={previewModal.open}>
                预览
              </Button>
            )}
          </div>

          {/* Desktop: Show all buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <ResumeUploader onUploadSuccess={handleUploadResume} disabled={chatLoading.isLoading} />
            {user && (
              <Button variant="ghost" size="sm" onClick={resumeListModal.toggle}>
                我的简历
              </Button>
            )}
            {resume && (
              <>
                <Button variant="primary" size="sm" onClick={previewModal.open}>
                  预览编辑
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopyResume}>
                  复制
                </Button>
                <Button 
                  variant={targetJob ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={targetJobModal.toggle}
                >
                  {targetJob || '目标岗位'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleScoreResume}
                  disabled={scoringLoading.isLoading}
                >
                  {scoringLoading.isLoading ? '评分中...' : '评分'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDiagnoseResume}
                  disabled={diagnosisLoading.isLoading}
                >
                  {diagnosisLoading.isLoading ? '诊断中...' : '诊断'}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShareResume}>
                  分享
                </Button>
                <Button variant="ghost" size="sm" onClick={templateSelectorModal.toggle}>
                  {currentTemplateName}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSaveResume} className="text-green-600 hover:text-green-700">
                  保存
                </Button>
                <ExportMenu
                  resumeText={resume}
                  resumeData={parsedResumeData}
                  templateName={currentTemplateName}
                  onExportPDF={handleExportPDF}
                  isExporting={isExporting}
                />
              </>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-gray-600 text-sm hidden sm:block">
                退出
              </button>
            </div>
          ) : (
            <Button size="sm" onClick={authModal.open}>
              登录
            </Button>
          )}
        </HeaderNav>
      </Header>

      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        {resumeListModal.isOpen && user && (
          <div className="p-4 border-b bg-white/80 backdrop-blur-sm animate-slide-down">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">我的简历</h3>
              <Button size="sm" onClick={handleNewResume}>新建简历</Button>
            </div>
            <ResumeList onSelectResume={handleSelectSavedResume} selectedId={editingResume?.id} />
          </div>
        )}

        {templateSelectorModal.isOpen && resume && (
          <div className="p-4 border-b bg-white/80 backdrop-blur-sm animate-slide-down">
            <TemplateSelector 
              selectedTemplate={selectedTemplate} 
              onSelectTemplate={setSelectedTemplate}
              previewData={parsedResumeData}
            />
          </div>
        )}

        {targetJobModal.isOpen && (
          <div className="p-4 border-b bg-white/80 backdrop-blur-sm animate-slide-down">
            <div className="max-w-md">
              <Input
                label="目标岗位"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="例如：前端开发工程师"
                helperText="设置目标岗位后，评分将更精准"
              />
              <div className="mt-3">
                <Button size="sm" onClick={targetJobModal.close}>确定</Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              avatar={user?.name?.charAt(0) || 'U'}
            />
          ))}
          {chatLoading.isLoading && (
            <ChatMessage role="assistant" content="" isLoading />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white/80 backdrop-blur-md p-4">
          <ChatInput
            onSubmit={handleSubmit}
            isLoading={chatLoading.isLoading}
          />
        </div>
      </div>

      {showPreview && resume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h3 className="font-bold">简历预览 - {currentTemplateName}</h3>
              <button onClick={() => setShowPreview(false)} className="text-white/80 hover:text-white text-xl">✕</button>
            </div>
            <div ref={resumeRef} className="overflow-auto max-h-[calc(90vh-60px)]">
              <ResumeTemplate data={parsedResumeData} template={selectedTemplate} />
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={authModal.isOpen} onClose={authModal.close} />

      <SaveResumeModal
        isOpen={saveModal.isOpen}
        onClose={saveModal.close}
        content={resume}
        template={selectedTemplate}
        editId={editingResume?.id}
        editTitle={editingResume?.title}
      />

      {scoreCardModal.isOpen && resumeScore && (
        <ResumeScoreCard score={resumeScore} onClose={scoreCardModal.close} />
      )}

      {previewModal.isOpen && resume && (
        <EditableResumePreview
          data={parsedResumeData}
          template={selectedTemplate}
          onSave={handleEditResumeData}
          onClose={previewModal.close}
        />
      )}

      {diagnosisModal.isOpen && diagnosisResult && (
        <ResumeDiagnosisCard
          result={diagnosisResult}
          onClose={diagnosisModal.close}
        />
      )}

      {showParser && rawResumeText && (
        <ResumeParser
          rawText={rawResumeText}
          onComplete={handleParserComplete}
          onCancel={handleParserCancel}
        />
      )}

      {/* Mobile Action Bar */}
      {resume && (
        <MobileActionBar
          onScore={handleScoreResume}
          onDiagnose={handleDiagnoseResume}
          onTemplate={templateSelectorModal.toggle}
          onTargetJob={targetJobModal.toggle}
          onShare={handleShareResume}
          onSave={handleSaveResume}
          targetJob={targetJob}
          templateName={currentTemplateName}
          isLoading={scoringLoading.isLoading || diagnosisLoading.isLoading}
        />
      )}
    </main>
  )
}
