export interface DiagnosisResult {
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  dimensions: DimensionDiagnosis[]
  issues: ResumeIssue[]
  quickWins: QuickWin[]
  detailedAnalysis: string
}

export interface DimensionDiagnosis {
  name: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'needs_work' | 'critical'
  analysis: string
  issues: string[]
  suggestions: string[]
}

export interface ResumeIssue {
  id: string
  type: 'critical' | 'warning' | 'suggestion'
  category: string
  title: string
  description: string
  location?: string
  fixSuggestion: string
  impact: 'high' | 'medium' | 'low'
}

export interface QuickWin {
  id: string
  title: string
  description: string
  effort: 'easy' | 'medium' | 'hard'
  impact: 'high' | 'medium' | 'low'
  beforeExample?: string
  afterExample?: string
}

export const issueTemplates = {
  missingName: {
    type: 'critical' as const,
    category: '基本信息',
    title: '缺少姓名',
    description: '简历中没有找到姓名信息',
    fixSuggestion: '在简历顶部添加您的真实姓名',
    impact: 'high' as const
  },
  missingContact: {
    type: 'critical' as const,
    category: '基本信息',
    title: '缺少联系方式',
    description: '简历中没有找到电话或邮箱等联系方式',
    fixSuggestion: '添加手机号码和邮箱地址，确保HR能联系到您',
    impact: 'high' as const
  },
  missingSummary: {
    type: 'warning' as const,
    category: '个人简介',
    title: '缺少个人简介',
    description: '简历中没有个人简介或自我评价',
    fixSuggestion: '添加2-3句话的个人简介，突出您的核心优势和求职意向',
    impact: 'medium' as const
  },
  shortSummary: {
    type: 'suggestion' as const,
    category: '个人简介',
    title: '个人简介过于简短',
    description: '个人简介内容太少，无法有效展示您的优势',
    fixSuggestion: '扩展个人简介，包含：您的专业背景、核心技能、求职意向',
    impact: 'medium' as const
  },
  missingEducation: {
    type: 'critical' as const,
    category: '教育背景',
    title: '缺少教育背景',
    description: '简历中没有教育背景信息',
    fixSuggestion: '添加教育经历，包括学校、专业、学历和时间',
    impact: 'high' as const
  },
  incompleteEducation: {
    type: 'warning' as const,
    category: '教育背景',
    title: '教育信息不完整',
    description: '教育背景缺少专业或学历信息',
    fixSuggestion: '补充完整的教育信息：学校名称、专业、学历、毕业时间',
    impact: 'medium' as const
  },
  missingExperience: {
    type: 'warning' as const,
    category: '工作经历',
    title: '缺少工作经历',
    description: '简历中没有工作经历信息',
    fixSuggestion: '添加工作经历，包括公司、职位、时间和主要职责/成就',
    impact: 'high' as const
  },
  shortExperience: {
    type: 'suggestion' as const,
    category: '工作经历',
    title: '工作经历描述过短',
    description: '工作经历描述过于简单，缺少具体内容',
    fixSuggestion: '使用STAR法则扩展工作经历：情境、任务、行动、结果',
    impact: 'medium' as const
  },
  noQuantifiedResults: {
    type: 'warning' as const,
    category: '成就量化',
    title: '缺少量化成果',
    description: '工作经历中没有使用数字来量化成果',
    fixSuggestion: '添加具体数据，如：提升了X%、节省了Y万、管理了Z人',
    impact: 'high' as const
  },
  vagueDescription: {
    type: 'suggestion' as const,
    category: '表达方式',
    title: '描述过于笼统',
    description: '使用了"负责"、"参与"等模糊词汇',
    fixSuggestion: '使用具体动词：主导、开发、优化、提升、创建等',
    impact: 'medium' as const
  },
  missingSkills: {
    type: 'warning' as const,
    category: '专业技能',
    title: '缺少技能列表',
    description: '简历中没有专业技能部分',
    fixSuggestion: '添加与目标岗位相关的技能关键词',
    impact: 'medium' as const
  },
  tooManySkills: {
    type: 'suggestion' as const,
    category: '专业技能',
    title: '技能列表过多',
    description: '列出了过多技能，可能显得不够聚焦',
    fixSuggestion: '精选8-12个与目标岗位最相关的技能',
    impact: 'low' as const
  },
  missingProjects: {
    type: 'suggestion' as const,
    category: '项目经验',
    title: '缺少项目经验',
    description: '简历中没有项目经验部分',
    fixSuggestion: '添加代表性项目，展示您的实际能力和成果',
    impact: 'medium' as const
  },
  longResume: {
    type: 'suggestion' as const,
    category: '简历长度',
    title: '简历内容过长',
    description: '简历内容超过2页，可能导致HR阅读疲劳',
    fixSuggestion: '精简内容，突出重点，控制在1-2页内',
    impact: 'low' as const
  },
  missingKeywords: {
    type: 'warning' as const,
    category: '关键词优化',
    title: '缺少岗位关键词',
    description: '简历中缺少与目标岗位匹配的关键词',
    fixSuggestion: '研究目标岗位JD，添加相关技能和行业术语',
    impact: 'high' as const
  }
}

export const quickWinTemplates = {
  addNumbers: {
    title: '添加量化数据',
    description: '在工作经历中添加具体的数字和百分比',
    effort: 'easy' as const,
    impact: 'high' as const,
    beforeExample: '负责用户增长工作',
    afterExample: '主导用户增长项目，3个月内用户数从1万增长到5万，增长400%'
  },
  useActionVerbs: {
    title: '使用行动动词开头',
    description: '将被动描述改为主动的行动动词',
    effort: 'easy' as const,
    impact: 'medium' as const,
    beforeExample: '负责项目的开发工作',
    afterExample: '主导开发XX项目，按时交付并节省30%开发成本'
  },
  addSummary: {
    title: '添加个人简介',
    description: '在简历顶部添加简短的个人介绍',
    effort: 'easy' as const,
    impact: 'medium' as const,
    afterExample: '5年前端开发经验，精通React/Vue技术栈，曾主导多个大型项目，追求代码质量与用户体验'
  },
  highlightAchievements: {
    title: '突出核心成就',
    description: '将最重要的成就放在显眼位置',
    effort: 'medium' as const,
    impact: 'high' as const,
    beforeExample: '参与了公司的项目开发',
    afterExample: '主导公司核心项目开发，服务100万+用户，系统可用性达99.9%'
  },
  tailorKeywords: {
    title: '针对岗位优化关键词',
    description: '根据目标岗位JD调整技能关键词',
    effort: 'medium' as const,
    impact: 'high' as const
  }
}

export function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function getStatusFromScore(score: number, maxScore: number): 'excellent' | 'good' | 'needs_work' | 'critical' {
  const percentage = (score / maxScore) * 100
  if (percentage >= 85) return 'excellent'
  if (percentage >= 70) return 'good'
  if (percentage >= 50) return 'needs_work'
  return 'critical'
}
