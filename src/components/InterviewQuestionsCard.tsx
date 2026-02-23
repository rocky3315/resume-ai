'use client'

import { useState } from 'react'
import { InterviewQuestion, InterviewQuestionsResult } from '@/lib/interviewQuestions'

interface InterviewQuestionsCardProps {
  result: InterviewQuestionsResult
  jobTitle: string
  onClose: () => void
}

export function InterviewQuestionsCard({ result, jobTitle, onClose }: InterviewQuestionsCardProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<InterviewQuestion | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-700'
      case 'behavioral':
        return 'bg-green-100 text-green-700'
      case 'situational':
        return 'bg-orange-100 text-orange-700'
      case 'project':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'hard':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '基础'
      case 'medium':
        return '进阶'
      case 'hard':
        return '挑战'
      default:
        return '综合'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'technical':
        return '技术'
      case 'behavioral':
        return '行为'
      case 'situational':
        return '情景'
      case 'project':
        return '项目'
      default:
        return '综合'
    }
  }

  const toggleExpand = (question: InterviewQuestion) => {
    setExpandedQuestion(expandedQuestion?.id === question.id ? null : question)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">面试问题预测</h2>
              <p className="text-white/80 text-sm">目标岗位：{jobTitle}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-180px)]">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">预测问题 ({result.questions.length} 个)</h3>
            <div className="space-y-3">
              {result.questions.map((question, index) => (
                <div 
                  key={question.id || index}
                  className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleExpand(question)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                          {getCategoryLabel(question.category)}
                        </span>
                        <span className={`text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {getDifficultyLabel(question.difficulty)}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900">{question.question}</h4>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedQuestion?.id === question.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {expandedQuestion?.id === question.id && (
                    <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">回答提示</h4>
                        <ul className="space-y-1">
                          {question.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {question.suggestedAnswer && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">建议回答</h4>
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{question.suggestedAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {result.overallTips.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">准备建议</h4>
              <ul className="space-y-2">
                {result.overallTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.preparationAdvice.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">注意事项</h4>
              <ul className="space-y-2">
                {result.preparationAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
