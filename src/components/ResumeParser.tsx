'use client'

import { useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { ResumeData, EducationItem, ExperienceItem, ProjectItem } from '@/lib/templates'

interface ResumeParserProps {
  rawText: string
  onComplete: (data: ResumeData) => void
  onCancel: () => void
}

export function ResumeParser({ rawText, onComplete, onCancel }: ResumeParserProps) {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<ResumeData>({
    name: '',
    phone: '',
    email: '',
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: []
  })

  const steps = [
    { key: 'name', label: '姓名', type: 'text' },
    { key: 'phone', label: '电话', type: 'text' },
    { key: 'email', label: '邮箱', type: 'text' },
    { key: 'summary', label: '个人简介', type: 'textarea' },
    { key: 'education', label: '教育背景', type: 'array' },
    { key: 'experience', label: '工作经历', type: 'array' },
    { key: 'projects', label: '项目经验', type: 'array' },
    { key: 'skills', label: '专业技能', type: 'skills' }
  ]

  const parseField = async (field: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/parse-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, field })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setData(prev => ({ ...prev, [field]: result.data }))
      }
    } catch (error) {
      console.error('Parse error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
      parseField(steps[step + 1].key)
    } else {
      onComplete(data)
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const updateField = (value: any) => {
    setData(prev => ({ ...prev, [steps[step].key]: value }))
  }

  const currentStep = steps[step]
  const currentValue = data[currentStep.key as keyof ResumeData]

  const renderFieldInput = () => {
    if (currentStep.type === 'text') {
      return (
        <Input
          label={currentStep.label}
          value={currentValue as string}
          onChange={(e) => updateField(e.target.value)}
          placeholder={`请输入${currentStep.label}`}
        />
      )
    }
    
    if (currentStep.type === 'textarea') {
      return (
        <Textarea
          label={currentStep.label}
          value={currentValue as string}
          onChange={(e) => updateField(e.target.value)}
          placeholder={`请输入${currentStep.label}`}
          rows={4}
        />
      )
    }
    
    if (currentStep.type === 'skills') {
      const skills = currentValue as string[]
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentStep.label}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => updateField(skills.filter((_, i) => i !== index))}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="添加技能"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement
                  if (input.value.trim()) {
                    updateField([...skills, input.value.trim()])
                    input.value = ''
                  }
                }
              }}
            />
          </div>
        </div>
      )
    }
    
    if (currentStep.type === 'array') {
      if (currentStep.key === 'education') {
        const items = currentValue as EducationItem[]
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentStep.label}
            </label>
            {items.map((item, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="学校"
                    value={item.school}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, school: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="专业"
                    value={item.major}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, major: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="学历"
                    value={item.degree}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, degree: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="时间"
                    value={item.time}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, time: e.target.value }
                      updateField(newItems)
                    }}
                  />
                </div>
                <button
                  onClick={() => updateField(items.filter((_, i) => i !== index))}
                  className="text-red-500 text-sm mt-1"
                >
                  删除
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateField([...items, { school: '', major: '', degree: '', time: '' }])}
            >
              + 添加教育经历
            </Button>
          </div>
        )
      }
      
      if (currentStep.key === 'experience') {
        const items = currentValue as ExperienceItem[]
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentStep.label}
            </label>
            {items.map((item, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Input
                    placeholder="公司"
                    value={item.company}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, company: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="职位"
                    value={item.position}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, position: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="时间"
                    value={item.time}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, time: e.target.value }
                      updateField(newItems)
                    }}
                  />
                </div>
                <Textarea
                  placeholder="工作成就（每行一条）"
                  value={item.achievements.join('\n')}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index] = { ...item, achievements: e.target.value.split('\n').filter(a => a.trim()) }
                    updateField(newItems)
                  }}
                  rows={3}
                />
                <button
                  onClick={() => updateField(items.filter((_, i) => i !== index))}
                  className="text-red-500 text-sm mt-1"
                >
                  删除
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateField([...items, { company: '', position: '', time: '', achievements: [] }])}
            >
              + 添加工作经历
            </Button>
          </div>
        )
      }
      
      if (currentStep.key === 'projects') {
        const items = currentValue as ProjectItem[]
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentStep.label}
            </label>
            {items.map((item, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Input
                    placeholder="项目名"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, name: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="角色"
                    value={item.role}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, role: e.target.value }
                      updateField(newItems)
                    }}
                  />
                  <Input
                    placeholder="时间"
                    value={item.time}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...item, time: e.target.value }
                      updateField(newItems)
                    }}
                  />
                </div>
                <Textarea
                  placeholder="项目描述"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index] = { ...item, description: e.target.value }
                    updateField(newItems)
                  }}
                  rows={2}
                />
                <button
                  onClick={() => updateField(items.filter((_, i) => i !== index))}
                  className="text-red-500 text-sm mt-1"
                >
                  删除
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateField([...items, { name: '', role: '', time: '', description: '' }])}
            >
              + 添加项目经验
            </Button>
          </div>
        )
      }
    }
    
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
          <h2 className="text-lg font-bold">解析简历</h2>
          <p className="text-white/80 text-sm">
            步骤 {step + 1} / {steps.length}：{currentStep.label}
          </p>
          <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 bg-gray-100 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-1">原始文本（可参考）：</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{rawText.substring(0, 500)}...</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">AI正在解析...</span>
            </div>
          ) : (
            renderFieldInput()
          )}
        </div>

        <div className="border-t p-4 flex justify-between">
          <Button variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={handlePrev}>
                上一步
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip}>
              跳过
            </Button>
            <Button onClick={handleNext} disabled={isLoading}>
              {step === steps.length - 1 ? '完成' : '下一步'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
