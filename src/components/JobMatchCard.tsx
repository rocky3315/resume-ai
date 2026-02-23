'use client'

import { JobMatchResult } from '@/lib/jobMatch'

interface JobMatchCardProps {
  result: JobMatchResult
  jobTitle: string
  onClose: () => void
}

export function JobMatchCard({ result, jobTitle, onClose }: JobMatchCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMatchGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 90) return '高度匹配'
    if (score >= 80) return '匹配度较高'
    if (score >= 70) return '基本匹配'
    if (score >= 60) return '部分匹配'
    return '匹配度较低'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${getMatchGradient(result.matchScore)} p-6 text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">岗位匹配度分析</h2>
              <p className="text-white/80 text-sm">目标岗位：{jobTitle}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">✕</button>
          </div>
          
          <div className="mt-6 flex items-center gap-6">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="white"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${result.matchScore * 3.01} 301`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{result.matchScore}%</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">{getMatchLabel(result.matchScore)}</div>
              <p className="text-white/80 text-sm">您的简历与该岗位的匹配程度</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-260px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                已具备技能
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
                待提升技能
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {result.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">简历亮点</h3>
              <ul className="space-y-2">
                {result.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">★</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">优化建议</h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-0.5">💡</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">简历中的关键词</h4>
              <div className="flex flex-wrap gap-1">
                {result.keywordAnalysis.present.slice(0, 5).map((keyword, index) => (
                  <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{keyword}</span>
                ))}
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="font-semibold text-orange-800 mb-2 text-sm">缺失的关键词</h4>
              <div className="flex flex-wrap gap-1">
                {result.keywordAnalysis.missing.slice(0, 5).map((keyword, index) => (
                  <span key={index} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{keyword}</span>
                ))}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm">推荐添加</h4>
              <div className="flex flex-wrap gap-1">
                {result.keywordAnalysis.recommended.slice(0, 5).map((keyword, index) => (
                  <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{keyword}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
