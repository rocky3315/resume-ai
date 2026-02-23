'use client'

import { DiagnosisResult, DimensionDiagnosis, ResumeIssue, QuickWin } from '@/lib/diagnosis'
import { Badge } from '@/components/ui'

interface ResumeDiagnosisCardProps {
  result: DiagnosisResult
  onClose: () => void
}

export function ResumeDiagnosisCard({ result, onClose }: ResumeDiagnosisCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100'
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C': return 'text-yellow-600 bg-yellow-100'
      case 'D': return 'text-orange-600 bg-orange-100'
      case 'F': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'needs_work': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getIssueTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-300 bg-red-50'
      case 'warning': return 'border-yellow-300 bg-yellow-50'
      case 'suggestion': return 'border-blue-300 bg-blue-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getIssueTypeBadge = (type: string) => {
    switch (type) {
      case 'critical': return <Badge variant="danger">严重</Badge>
      case 'warning': return <Badge variant="warning">警告</Badge>
      case 'suggestion': return <Badge variant="info">建议</Badge>
      default: return null
    }
  }

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '复杂'
      default: return effort
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">简历诊断报告</h2>
              <p className="text-white/80 text-sm mt-1">发现 {result.issues.length} 个可优化项</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold">{result.overallScore}</div>
                <div className="text-white/80 text-sm">综合评分</div>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold ${getGradeColor(result.grade)}`}>
                {result.grade}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
          <section>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">📊</span>
              维度分析
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.dimensions.map((dim, index) => (
                <DimensionCard key={index} dimension={dim} getStatusColor={getStatusColor} />
              ))}
            </div>
          </section>

          {result.quickWins.length > 0 && (
            <section>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">⚡</span>
                快速优化建议
              </h3>
              <div className="space-y-3">
                {result.quickWins.map((win, index) => (
                  <QuickWinCard key={index} quickWin={win} getEffortLabel={getEffortLabel} />
                ))}
              </div>
            </section>
          )}

          {result.issues.length > 0 && (
            <section>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm">🔍</span>
                问题详情
              </h3>
              <div className="space-y-3">
                {result.issues.map((issue, index) => (
                  <IssueCard 
                    key={index} 
                    issue={issue} 
                    getIssueTypeColor={getIssueTypeColor}
                    getIssueTypeBadge={getIssueTypeBadge}
                  />
                ))}
              </div>
            </section>
          )}

          {result.detailedAnalysis && (
            <section>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">📝</span>
                详细分析
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {result.detailedAnalysis}
              </div>
            </section>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

function DimensionCard({ dimension, getStatusColor }: { dimension: DimensionDiagnosis; getStatusColor: (status: string) => string }) {
  const percentage = (dimension.score / dimension.maxScore) * 100

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-900">{dimension.name}</span>
        <span className="text-sm text-gray-600">{dimension.score}/{dimension.maxScore}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full transition-all ${getStatusColor(dimension.status)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{dimension.analysis}</p>
    </div>
  )
}

function QuickWinCard({ quickWin, getEffortLabel }: { quickWin: QuickWin; getEffortLabel: (effort: string) => string }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{quickWin.title}</h4>
        <div className="flex gap-2">
          <Badge variant="default" size="sm">难度: {getEffortLabel(quickWin.effort)}</Badge>
          <Badge variant="success" size="sm">影响: {quickWin.impact === 'high' ? '高' : quickWin.impact === 'medium' ? '中' : '低'}</Badge>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{quickWin.description}</p>
      {quickWin.beforeExample && quickWin.afterExample && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <div className="text-xs text-red-600 font-medium mb-1">修改前</div>
            <p className="text-sm text-gray-600">{quickWin.beforeExample}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-xs text-green-600 font-medium mb-1">修改后</div>
            <p className="text-sm text-gray-600">{quickWin.afterExample}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function IssueCard({ issue, getIssueTypeColor, getIssueTypeBadge }: { 
  issue: ResumeIssue
  getIssueTypeColor: (type: string) => string
  getIssueTypeBadge: (type: string) => React.ReactNode
}) {
  return (
    <div className={`border rounded-xl p-4 ${getIssueTypeColor(issue.type)}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getIssueTypeBadge(issue.type)}
          <Badge variant="default" size="sm">{issue.category}</Badge>
        </div>
        {issue.location && (
          <span className="text-xs text-gray-500">位置: {issue.location}</span>
        )}
      </div>
      <h4 className="font-medium text-gray-900 mb-1">{issue.title}</h4>
      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
      <div className="bg-white/50 rounded-lg p-2 text-sm">
        <span className="text-gray-500">💡 修复建议：</span>
        <span className="text-gray-700">{issue.fixSuggestion}</span>
      </div>
    </div>
  )
}
