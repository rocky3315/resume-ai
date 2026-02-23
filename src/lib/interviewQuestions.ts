export interface InterviewQuestion {
  id: string
  question: string
  category: 'technical' | 'behavioral' | 'situational' | 'project'
  difficulty: 'easy' | 'medium' | 'hard'
  tips: string[]
  suggestedAnswer?: string
}

export interface InterviewQuestionsResult {
  questions: InterviewQuestion[]
  overallTips: string[]
  preparationAdvice: string[]
}
