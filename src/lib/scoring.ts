export interface ResumeScore {
  overall: number
  dimensions: ScoreDimension[]
  suggestions: string[]
  strengths: string[]
}

export interface ScoreDimension {
  name: string
  score: number
  maxScore: number
  description: string
  tips: string[]
}

export const dimensionNames = {
  completeness: '完整度',
  relevance: '相关性',
  clarity: '清晰度',
  impact: '影响力',
  keywords: '关键词'
}

export const dimensionDescriptions: Record<string, string> = {
  completeness: '简历信息是否完整，是否包含必要的个人信息、教育背景、工作经历等',
  relevance: '简历内容是否与目标岗位相关，是否突出相关技能和经验',
  clarity: '简历表达是否清晰，语言是否简洁有力，排版是否整洁',
  impact: '工作成就是否量化，是否有具体的数据和结果支撑',
  keywords: '是否包含行业关键词和岗位相关技能词汇'
}
