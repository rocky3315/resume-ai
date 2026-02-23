export type TemplateType = 'classic' | 'modern' | 'minimal' | 'creative'

export interface ResumeData {
  name: string
  phone?: string
  email?: string
  summary?: string
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: string[]
}

export interface EducationItem {
  school: string
  major: string
  degree: string
  time: string
}

export interface ExperienceItem {
  company: string
  position: string
  time: string
  achievements: string[]
}

export interface ProjectItem {
  name: string
  role: string
  time: string
  description: string
}

export interface Template {
  id: TemplateType
  name: string
  description: string
  preview: string
}

export const templates: Template[] = [
  {
    id: 'classic',
    name: '经典风格',
    description: '传统专业，适合金融、政府等传统行业',
    preview: '📄'
  },
  {
    id: 'modern',
    name: '现代风格',
    description: '简洁时尚，适合互联网、科技行业',
    preview: '✨'
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '简约大方，突出内容本身',
    preview: '📝'
  },
  {
    id: 'creative',
    name: '创意风格',
    description: '个性鲜明，适合设计、创意行业',
    preview: '🎨'
  }
]

export function parseResumeText(text: string): ResumeData {
  const data: ResumeData = {
    name: '',
    phone: '',
    email: '',
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: []
  }

  if (!text) return data

  const lines = text.split('\n').map(line => line.trim()).filter(line => line)
  
  let currentSection = ''
  let currentExperience: ExperienceItem | null = null
  let currentProject: ProjectItem | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('---') || line.startsWith('===')) continue
    
    if (line.startsWith('【') && line.endsWith('】')) {
      const title = line.replace(/【|】/g, '').trim()
      if (title.includes('教育')) currentSection = 'education'
      else if (title.includes('工作') || title.includes('经历')) currentSection = 'experience'
      else if (title.includes('项目')) currentSection = 'projects'
      else if (title.includes('技能') || title.includes('能力')) currentSection = 'skills'
      else if (title.includes('简介') || title.includes('介绍') || title.includes('评价')) currentSection = 'summary'
      else currentSection = ''
      continue
    }

    if (!data.name && !line.includes('：') && !line.includes(':') && !line.startsWith('-') && line.length > 1 && line.length < 20 && !/\d/.test(line)) {
      data.name = line
      continue
    }

    if (line.includes('电话') || line.includes('手机') || line.includes('联系方式')) {
      const match = line.match(/[\d\-+\s]{7,}/)
      if (match) {
        data.phone = match[0].trim()
      } else {
        const parts = line.split(/[：:]/)
        if (parts[1]) data.phone = parts[1].trim()
      }
      continue
    }

    if (line.includes('邮箱') || line.includes('email') || line.includes('Email')) {
      const match = line.match(/[\w.-]+@[\w.-]+\.\w+/)
      if (match) {
        data.email = match[0].trim()
      } else {
        const parts = line.split(/[：:]/)
        if (parts[1]) data.email = parts[1].trim()
      }
      continue
    }

    if (currentSection === 'summary') {
      if (!line.startsWith('【') && !line.startsWith('---')) {
        data.summary = (data.summary || '') + line + ' '
      }
      continue
    }

    if (currentSection === 'education') {
      if (line.startsWith('-')) continue
      const parts = line.split(/[|｜]/).map(p => p.trim()).filter(p => p)
      if (parts.length >= 2) {
        data.education.push({
          school: parts[0] || '',
          major: parts[1] || '',
          degree: parts[2] || '',
          time: parts[3] || ''
        })
      }
      continue
    }

    if (currentSection === 'experience') {
      if (line.startsWith('-')) {
        const achievement = line.substring(1).trim()
        if (currentExperience && achievement) {
          currentExperience.achievements.push(achievement)
        }
      } else {
        if (currentExperience && currentExperience.company) {
          data.experience.push(currentExperience)
        }
        const parts = line.split(/[|｜]/).map(p => p.trim()).filter(p => p)
        if (parts.length >= 2) {
          currentExperience = {
            company: parts[0] || '',
            position: parts[1] || '',
            time: parts[2] || '',
            achievements: []
          }
        }
      }
      continue
    }

    if (currentSection === 'projects') {
      if (line.startsWith('-')) {
        const desc = line.substring(1).trim()
        if (currentProject && desc) {
          currentProject.description = (currentProject.description || '') + desc + ' '
        }
      } else {
        if (currentProject && currentProject.name) {
          data.projects.push(currentProject)
        }
        const parts = line.split(/[|｜]/).map(p => p.trim()).filter(p => p)
        if (parts.length >= 2) {
          currentProject = {
            name: parts[0] || '',
            role: parts[1] || '',
            time: parts[2] || '',
            description: ''
          }
        }
      }
      continue
    }

    if (currentSection === 'skills') {
      const skills = line.split(/[、,，\/\n]/).map(s => s.trim()).filter(s => s && s.length < 30)
      data.skills.push(...skills)
      continue
    }
  }

  if (currentExperience && currentExperience.company) {
    data.experience.push(currentExperience)
  }
  if (currentProject && currentProject.name) {
    data.projects.push(currentProject)
  }

  data.summary = data.summary?.trim()
  data.skills = Array.from(new Set(data.skills))

  return data
}
