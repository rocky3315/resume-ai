'use client'

import { templates, TemplateType, ResumeData } from '@/lib/templates'
import { cn } from '@/lib/utils'

interface TemplateSelectorProps {
  selectedTemplate: TemplateType
  onSelectTemplate: (template: TemplateType) => void
  previewData?: ResumeData
}

// 模拟简历数据用于预览
const defaultPreviewData: ResumeData = {
  name: '张三',
  phone: '138-0000-0000',
  email: 'zhangsan@email.com',
  summary: '5年前端开发经验，精通React、Vue等主流框架，有丰富的大型项目开发经验。',
  education: [
    { school: '北京大学', major: '计算机科学', degree: '本科', time: '2015-2019' }
  ],
  experience: [
    {
      company: '科技有限公司',
      position: '高级前端工程师',
      time: '2019-至今',
      achievements: ['负责公司核心产品前端开发', '优化页面性能，提升加载速度50%']
    }
  ],
  projects: [
    {
      name: '电商平台',
      role: '前端负责人',
      time: '2020-2021',
      description: '负责整个平台的前端架构设计和开发'
    }
  ],
  skills: ['React', 'Vue', 'TypeScript', 'Node.js']
}

function TemplatePreview({ template, data }: { template: TemplateType; data: ResumeData }) {
  const renderClassic = () => (
    <div className="space-y-2 text-xs">
      <div className="text-center border-b pb-2">
        <div className="font-bold text-sm">{data.name}</div>
        <div className="text-gray-500 text-[10px]">{data.phone} | {data.email}</div>
      </div>
      <div>
        <div className="font-bold border-b text-[10px] uppercase tracking-wider">教育背景</div>
        {data.education.map((edu, i) => (
          <div key={i} className="text-[10px]">
            <span className="font-medium">{edu.school}</span> - {edu.major}
          </div>
        ))}
      </div>
      <div>
        <div className="font-bold border-b text-[10px] uppercase tracking-wider">工作经历</div>
        {data.experience.map((exp, i) => (
          <div key={i} className="text-[10px]">
            <div className="font-medium">{exp.company} | {exp.position}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderModern = () => (
    <div className="space-y-2 text-xs">
      <div className="bg-blue-600 text-white p-2 rounded">
        <div className="font-bold text-sm">{data.name}</div>
        <div className="text-[10px] opacity-90">{data.phone} · {data.email}</div>
      </div>
      <div className="space-y-1">
        {data.experience.map((exp, i) => (
          <div key={i} className="bg-gray-50 p-1.5 rounded text-[10px]">
            <div className="font-medium text-blue-600">{exp.position}</div>
            <div className="text-gray-500">{exp.company}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMinimal = () => (
    <div className="space-y-3 text-xs">
      <div>
        <div className="text-lg font-light">{data.name}</div>
        <div className="text-gray-400 text-[10px]">{data.email}</div>
      </div>
      <div className="space-y-2">
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between text-[10px]">
            <span>{edu.school}</span>
            <span className="text-gray-400">{edu.time}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCreative = () => (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
          {data.name[0]}
        </div>
        <div>
          <div className="font-bold text-sm">{data.name}</div>
          <div className="text-[10px] text-purple-600">{data.experience[0]?.position}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {data.skills.slice(0, 3).map((skill, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[8px]">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )

  switch (template) {
    case 'classic':
      return renderClassic()
    case 'modern':
      return renderModern()
    case 'minimal':
      return renderMinimal()
    case 'creative':
      return renderCreative()
    default:
      return renderModern()
  }
}

export function TemplateSelector({ 
  selectedTemplate, 
  onSelectTemplate,
  previewData = defaultPreviewData
}: TemplateSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">选择简历模板</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={cn(
              'p-3 rounded-lg border-2 text-left transition-all hover:shadow-md',
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            {/* Template Preview */}
            <div className={cn(
              'mb-3 p-3 rounded border bg-white h-32 overflow-hidden',
              selectedTemplate === template.id ? 'border-blue-200' : 'border-gray-100'
            )}>
              <TemplatePreview template={template.id} data={previewData} />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xl">{template.preview}</span>
              <div>
                <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </div>
            
            {selectedTemplate === template.id && (
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已选择
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
