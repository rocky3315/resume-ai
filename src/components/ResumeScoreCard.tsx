'use client'

import { ResumeScore, ScoreDimension } from '@/lib/scoring'

interface ResumeScoreCardProps {
  score: ResumeScore
  onClose: () => void
}

export function ResumeScoreCard({ score, onClose }: ResumeScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 70) return '中等'
    if (score >= 60) return '及格'
    return '需改进'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${getScoreGradient(score.overall)} p-6 text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">简历评分报告</h2>
              <p className="text-white/80 text-sm">基于AI分析，为您提供专业的简历优化建议</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">✕</button>
          </div>
          
          <div className="mt-6 flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${score.overall * 3.52} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{score.overall}</span>
                <span className="text-sm text-white/80">总分</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{getScoreLabel(score.overall)}</div>
              <p className="text-white/80 text-sm">您的简历质量{score.overall >= 70 ? '较好' : '有待提升'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-280px)]">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">各维度评分</h3>
            <div className="space-y-4">
              {score.dimensions.map((dim, index) => (
                <DimensionBar key={index} dimension={dim} />
              ))}
            </div>
          </div>

          {score.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
                简历亮点
              </h3>
              <ul className="space-y-2">
                {score.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {score.suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">💡</span>
                优化建议
              </h3>
              <ul className="space-y-2">
                {score.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {suggestion}
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

function DimensionBar({ dimension }: { dimension: ScoreDimension }) {
  const percentage = (dimension.score / dimension.maxScore) * 100
  
  const getBarColor = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100
    if (pct >= 80) return 'bg-green-500'
    if (pct >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-900">{dimension.name}</span>
        <span className="text-sm text-gray-600">{dimension.score}/{dimension.maxScore}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(dimension.score, dimension.maxScore)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{dimension.description}</p>
      {dimension.tips.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          {dimension.tips.map((tip, i) => (
            <p key={i} className="text-xs text-gray-500 mt-1">• {tip}</p>
          ))}
        </div>
      )}
    </div>
  )
}
