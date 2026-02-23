export interface InterviewSession {
  id: string
  resumeContent: string
  targetJob: string
  questions: InterviewMessage[]
  status: 'active' | 'completed'
  score?: number
  feedback?: string
  createdAt: string
}

export interface InterviewMessage {
  id: string
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: string
  feedback?: string
}

export interface InterviewFeedback {
  overallScore: number
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
}
