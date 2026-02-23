'use client'

import { useState, useRef, useEffect } from 'react'
import { ResumeData, EducationItem, ExperienceItem, ProjectItem, TemplateType } from '@/lib/templates'
import { ResumeTemplate } from '@/components/ResumeTemplate'
import { Button, Modal, Input, Textarea } from '@/components/ui'
import { useToast } from '@/components/ui'

interface EditableResumePreviewProps {
  data: ResumeData
  template: TemplateType
  onSave: (data: ResumeData) => void
  onClose: () => void
}

type EditField = 
  | { type: 'name' | 'phone' | 'email' | 'summary'; value: string }
  | { type: 'education'; value: EducationItem; index: number }
  | { type: 'experience'; value: ExperienceItem; index: number }
  | { type: 'project'; value: ProjectItem; index: number }
  | { type: 'skills'; value: string[] }
  | { type: 'achievement'; expIndex: number; achIndex: number; value: string }

export function EditableResumePreview({ data, template, onSave, onClose }: EditableResumePreviewProps) {
  const [editData, setEditData] = useState<ResumeData>(data)
  const [editingField, setEditingField] = useState<EditField | null>(null)
  const [editMode, setEditMode] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  const handleSave = () => {
    onSave(editData)
    showToast('简历已保存', 'success')
  }

  const updateField = (updates: Partial<ResumeData>) => {
    setEditData(prev => ({ ...prev, ...updates }))
  }

  const handleEditField = (field: EditField) => {
    setEditingField(field)
  }

  const handleSaveField = (value: string | EducationItem | ExperienceItem | ProjectItem | string[]) => {
    if (!editingField) return

    switch (editingField.type) {
      case 'name':
        updateField({ name: value as string })
        break
      case 'phone':
        updateField({ phone: value as string })
        break
      case 'email':
        updateField({ email: value as string })
        break
      case 'summary':
        updateField({ summary: value as string })
        break
      case 'education':
        const newEducation = [...editData.education]
        newEducation[editingField.index] = value as EducationItem
        updateField({ education: newEducation })
        break
      case 'experience':
        const newExperience = [...editData.experience]
        newExperience[editingField.index] = value as ExperienceItem
        updateField({ experience: newExperience })
        break
      case 'project':
        const newProjects = [...editData.projects]
        newProjects[editingField.index] = value as ProjectItem
        updateField({ projects: newProjects })
        break
      case 'skills':
        updateField({ skills: value as string[] })
        break
      case 'achievement':
        const expWithAch = [...editData.experience]
        expWithAch[editingField.expIndex].achievements[editingField.achIndex] = value as string
        updateField({ experience: expWithAch })
        break
    }

    setEditingField(null)
  }

  const addEducation = () => {
    const newEdu: EducationItem = { school: '', major: '', degree: '', time: '' }
    setEditingField({ type: 'education', value: newEdu, index: editData.education.length })
    updateField({ education: [...editData.education, newEdu] })
  }

  const addExperience = () => {
    const newExp: ExperienceItem = { company: '', position: '', time: '', achievements: [] }
    setEditingField({ type: 'experience', value: newExp, index: editData.experience.length })
    updateField({ experience: [...editData.experience, newExp] })
  }

  const addProject = () => {
    const newProj: ProjectItem = { name: '', role: '', time: '', description: '' }
    setEditingField({ type: 'project', value: newProj, index: editData.projects.length })
    updateField({ projects: [...editData.projects, newProj] })
  }

  const removeEducation = (index: number) => {
    updateField({ education: editData.education.filter((_, i) => i !== index) })
  }

  const removeExperience = (index: number) => {
    updateField({ experience: editData.experience.filter((_, i) => i !== index) })
  }

  const removeProject = (index: number) => {
    updateField({ projects: editData.projects.filter((_, i) => i !== index) })
  }

  const addAchievement = (expIndex: number) => {
    const newExp = [...editData.experience]
    newExp[expIndex].achievements.push('')
    updateField({ experience: newExp })
    setEditingField({ type: 'achievement', expIndex, achIndex: newExp[expIndex].achievements.length - 1, value: '' })
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const newExp = [...editData.experience]
    newExp[expIndex].achievements = newExp[expIndex].achievements.filter((_, i) => i !== achIndex)
    updateField({ experience: newExp })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-scale-in flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-lg">简历预览</h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                editMode ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {editMode ? '预览模式' : '编辑模式'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleSave}>
              保存修改
            </Button>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {editMode ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <EditSection title="基本信息">
                <div className="grid grid-cols-2 gap-4">
                  <EditableField
                    label="姓名"
                    value={editData.name}
                    onClick={() => handleEditField({ type: 'name', value: editData.name })}
                  />
                  <EditableField
                    label="电话"
                    value={editData.phone || ''}
                    onClick={() => handleEditField({ type: 'phone', value: editData.phone || '' })}
                  />
                </div>
                <EditableField
                  label="邮箱"
                  value={editData.email || ''}
                  onClick={() => handleEditField({ type: 'email', value: editData.email || '' })}
                />
                <EditableField
                  label="个人简介"
                  value={editData.summary || ''}
                  multiline
                  onClick={() => handleEditField({ type: 'summary', value: editData.summary || '' })}
                />
              </EditSection>

              <EditSection title="教育背景" onAdd={addEducation}>
                {editData.education.map((edu, index) => (
                  <div key={index} className="relative group">
                    <div 
                      className="bg-white p-4 rounded-lg border cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={() => handleEditField({ type: 'education', value: edu, index })}
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{edu.school || '点击编辑学校'}</span>
                        <span className="text-gray-500 text-sm">{edu.time}</span>
                      </div>
                      <div className="text-gray-600 text-sm">{edu.major} | {edu.degree}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeEducation(index); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </EditSection>

              <EditSection title="工作经历" onAdd={addExperience}>
                {editData.experience.map((exp, expIndex) => (
                  <div key={expIndex} className="relative group bg-white p-4 rounded-lg border mb-3">
                    <button
                      onClick={() => removeExperience(expIndex)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleEditField({ type: 'experience', value: exp, index: expIndex })}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{exp.company || '点击编辑公司'}</span>
                        <span className="text-gray-500 text-sm">{exp.time}</span>
                      </div>
                      <div className="text-blue-600 text-sm mb-2">{exp.position}</div>
                    </div>
                    <div className="space-y-1">
                      {exp.achievements.map((ach, achIndex) => (
                        <div key={achIndex} className="flex items-start gap-2 group/ach">
                          <span className="text-blue-500">▸</span>
                          <span 
                            className="text-gray-600 text-sm flex-1 cursor-pointer hover:bg-blue-50 px-1 rounded"
                            onClick={() => handleEditField({ type: 'achievement', expIndex, achIndex, value: ach })}
                          >
                            {ach || '点击编辑成就'}
                          </span>
                          <button
                            onClick={() => removeAchievement(expIndex, achIndex)}
                            className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover/ach:opacity-100"
                          >
                            删除
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addAchievement(expIndex)}
                        className="text-blue-500 text-sm hover:text-blue-600"
                      >
                        + 添加成就
                      </button>
                    </div>
                  </div>
                ))}
              </EditSection>

              <EditSection title="项目经验" onAdd={addProject}>
                {editData.projects.map((proj, index) => (
                  <div key={index} className="relative group">
                    <div 
                      className="bg-white p-4 rounded-lg border cursor-pointer hover:border-blue-300 transition-colors mb-3"
                      onClick={() => handleEditField({ type: 'project', value: proj, index })}
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{proj.name || '点击编辑项目'}</span>
                        <span className="text-gray-500 text-sm">{proj.time}</span>
                      </div>
                      <div className="text-blue-600 text-sm">{proj.role}</div>
                      <div className="text-gray-600 text-sm mt-1">{proj.description}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeProject(index); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </EditSection>

              <EditSection title="专业技能">
                <div 
                  className="bg-white p-4 rounded-lg border cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => handleEditField({ type: 'skills', value: editData.skills })}
                >
                  <div className="flex flex-wrap gap-2">
                    {editData.skills.length > 0 ? (
                      editData.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">点击添加技能</span>
                    )}
                  </div>
                </div>
              </EditSection>
            </div>
          ) : (
            <div ref={resumeRef} className="flex justify-center">
              <ResumeTemplate data={editData} template={template} />
            </div>
          )}
        </div>
      </div>

      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={handleSaveField}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  )
}

function EditSection({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="text-blue-500 text-sm hover:text-blue-600">
            + 添加
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function EditableField({ 
  label, 
  value, 
  multiline = false, 
  onClick 
}: { 
  label: string
  value: string
  multiline?: boolean
  onClick: () => void 
}) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className={`bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors ${multiline ? 'p-3 min-h-[80px]' : 'px-3 py-2'}`}>
        {value || <span className="text-gray-400">点击编辑</span>}
      </div>
    </div>
  )
}

function FieldEditor({ field, onSave, onClose }: { field: EditField; onSave: (value: any) => void; onClose: () => void }) {
  const [value, setValue] = useState<any>(field.value)

  const handleSave = () => {
    onSave(value)
  }

  const renderEditor = () => {
    switch (field.type) {
      case 'name':
      case 'phone':
      case 'email':
        return (
          <Input
            label={field.type === 'name' ? '姓名' : field.type === 'phone' ? '电话' : '邮箱'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`请输入${field.type === 'name' ? '姓名' : field.type === 'phone' ? '电话' : '邮箱'}`}
          />
        )
      case 'summary':
        return (
          <Textarea
            label="个人简介"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入个人简介"
            rows={4}
          />
        )
      case 'education':
        return (
          <div className="space-y-4">
            <Input label="学校" value={value.school} onChange={(e) => setValue({ ...value, school: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="专业" value={value.major} onChange={(e) => setValue({ ...value, major: e.target.value })} />
              <Input label="学位" value={value.degree} onChange={(e) => setValue({ ...value, degree: e.target.value })} />
            </div>
            <Input label="时间" value={value.time} onChange={(e) => setValue({ ...value, time: e.target.value })} placeholder="如：2020.09 - 2024.06" />
          </div>
        )
      case 'experience':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="公司" value={value.company} onChange={(e) => setValue({ ...value, company: e.target.value })} />
              <Input label="职位" value={value.position} onChange={(e) => setValue({ ...value, position: e.target.value })} />
            </div>
            <Input label="时间" value={value.time} onChange={(e) => setValue({ ...value, time: e.target.value })} placeholder="如：2022.06 - 至今" />
          </div>
        )
      case 'project':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="项目名称" value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} />
              <Input label="角色" value={value.role} onChange={(e) => setValue({ ...value, role: e.target.value })} />
            </div>
            <Input label="时间" value={value.time} onChange={(e) => setValue({ ...value, time: e.target.value })} />
            <Textarea label="描述" value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} rows={3} />
          </div>
        )
      case 'skills':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">专业技能</label>
            <Textarea
              value={value.join('、')}
              onChange={(e) => setValue(e.target.value.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean))}
              placeholder="用顿号或逗号分隔，如：JavaScript、React、Node.js"
              rows={3}
            />
          </div>
        )
      case 'achievement':
        return (
          <Textarea
            label="成就描述"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请描述具体成就，建议使用量化数据"
            rows={2}
          />
        )
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="编辑内容" size="md">
      <div className="p-6">
        {renderEditor()}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </div>
    </Modal>
  )
}
