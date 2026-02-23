export interface JobMatchResult {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  highlights: string[]
  keywordAnalysis: KeywordAnalysis
}

export interface KeywordAnalysis {
  present: string[]
  missing: string[]
  recommended: string[]
}
