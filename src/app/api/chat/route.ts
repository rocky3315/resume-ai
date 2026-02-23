import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SYSTEM_PROMPT = `你是一位专业的简历撰写专家和职业顾问。你的任务是帮助用户生成和优化专业简历。

## 你的能力
1. 通过对话收集用户信息，生成专业简历
2. 根据目标岗位JD优化现有简历
3. 提供职业发展建议
4. 对简历进行评分和分析

## 工作流程
当用户想生成新简历时，按以下顺序收集信息：
1. 基本信息：姓名、联系方式
2. 教育背景：学校、专业、学历、时间
3. 工作经历：公司、职位、时间、主要工作内容和成就
4. 项目经验：项目名称、角色、主要贡献
5. 专业技能：技术栈、工具、证书等

## 简历撰写原则
1. 使用STAR法则描述工作经历（情境、任务、行动、结果）
2. 突出成就和量化数据
3. 使用行业专业术语
4. 语言简洁有力，避免空洞描述
5. 根据目标岗位调整重点

## 输出格式
当收集完信息后，使用以下格式输出简历：

---简历开始---
【姓名】
电话：xxx | 邮箱：xxx

【个人简介】
2-3句话概述核心优势和职业目标

【教育背景】
学校 | 专业 | 学历 | 时间

【工作经历】
公司名称 | 职位 | 时间
- 工作内容1（量化成果）
- 工作内容2（量化成果）

【项目经验】
项目名称 | 角色 | 时间
- 项目描述和贡献

【专业技能】
技能1、技能2、技能3...
---简历结束---

## 注意事项
1. 每次只问一个问题，不要一次问太多
2. 对用户的信息给予积极反馈
3. 如果信息不够详细，可以追问
4. 保持友好和专业的语气
5. 当用户说"生成简历"或类似意思时，输出完整简历`

const SCORING_PROMPT = `你是一位专业的简历评审专家。请对以下简历进行全面评分和分析。

简历内容：
{resume}

目标岗位：{targetJob}

请严格按照以下JSON格式返回评分结果（不要包含任何其他文字）：
{
  "overall": 85,
  "dimensions": [
    {
      "name": "完整度",
      "score": 20,
      "maxScore": 25,
      "description": "简历信息是否完整",
      "tips": ["建议添加更多项目经验", "可以补充个人简介"]
    },
    {
      "name": "相关性",
      "score": 18,
      "maxScore": 25,
      "description": "简历内容是否与目标岗位相关",
      "tips": ["可以突出更多相关技能"]
    },
    {
      "name": "清晰度",
      "score": 15,
      "maxScore": 20,
      "description": "简历表达是否清晰",
      "tips": []
    },
    {
      "name": "影响力",
      "score": 12,
      "maxScore": 20,
      "description": "工作成就是否量化",
      "tips": ["建议添加更多量化数据"]
    },
    {
      "name": "关键词",
      "score": 8,
      "maxScore": 10,
      "description": "是否包含行业关键词",
      "tips": []
    }
  ],
  "suggestions": [
    "建议1：添加更多量化成果",
    "建议2：突出核心技能"
  ],
  "strengths": [
    "亮点1：工作经历描述清晰",
    "亮点2：技能匹配度高"
  ]
}

评分标准：
- 完整度(25分)：是否包含个人信息、教育背景、工作经历、项目经验、技能等必要信息
- 相关性(25分)：内容是否与目标岗位匹配，是否突出相关经验
- 清晰度(20分)：语言是否简洁有力，排版是否清晰
- 影响力(20分)：是否有量化数据和具体成果
- 关键词(10分)：是否包含行业关键词和技能词汇`

const JOB_MATCH_PROMPT = `你是一位专业的职业顾问。请分析以下简历与目标岗位的匹配度。

简历内容：
{resume}

目标岗位JD：
{jobDescription}

目标岗位：{targetJob}

请严格按照以下JSON格式返回匹配分析结果（不要包含任何其他文字）：
{
  "matchScore": 75,
  "matchedSkills": ["技能1", "技能2"],
  "missingSkills": ["缺失技能1", "缺失技能2"],
  "suggestions": [
    "建议1：突出XX经验",
    "建议2：补充XX技能"
  ],
  "highlights": [
    "亮点1：相关经验丰富",
    "亮点2：技能匹配度高"
  ],
  "keywordAnalysis": {
    "present": ["关键词1", "关键词2"],
    "missing": ["缺失关键词1"],
    "recommended": ["推荐关键词1"]
  }
}`

const INTERVIEW_PROMPT = `你是一位专业的面试官，正在对候选人进行模拟面试。

候选人简历：
{resume}

目标岗位：{targetJob}

面试规则：
1. 每次只问一个问题
2. 根据候选人回答进行追问或进入下一个话题
3. 问题类型包括：技术问题、项目经验、行为面试、情景问题
4. 保持专业友好的态度
5. 在候选人回答后给予简短反馈
6. 面试共进行5-8个问题，然后给出综合评价

面试开始时，先简单自我介绍，然后请候选人自我介绍。

当面试结束时，请在回复最后包含以下JSON格式的反馈：
---面试反馈---
{
  "overallScore": 75,
  "strengths": ["表现亮点1", "表现亮点2"],
  "improvements": ["改进建议1", "改进建议2"],
  "detailedFeedback": "详细的面试评价..."
}
---面试反馈结束---`

const DIAGNOSIS_PROMPT = `你是一位专业的简历诊断专家。请对以下简历进行全面诊断，找出问题并提供优化建议。

简历内容：
{resume}

目标岗位：{targetJob}

请严格按照以下JSON格式返回诊断结果（不要包含任何其他文字）：
{
  "overallScore": 75,
  "grade": "B",
  "dimensions": [
    {
      "name": "基本信息",
      "score": 15,
      "maxScore": 20,
      "status": "good",
      "analysis": "基本信息较为完整，但缺少...",
      "issues": ["缺少邮箱"],
      "suggestions": ["添加专业邮箱地址"]
    },
    {
      "name": "个人简介",
      "score": 8,
      "maxScore": 15,
      "status": "needs_work",
      "analysis": "个人简介存在以下问题...",
      "issues": ["过于简短", "缺少求职意向"],
      "suggestions": ["扩展到2-3句话", "明确求职目标"]
    },
    {
      "name": "教育背景",
      "score": 18,
      "maxScore": 20,
      "status": "excellent",
      "analysis": "教育背景完整清晰",
      "issues": [],
      "suggestions": []
    },
    {
      "name": "工作经历",
      "score": 12,
      "maxScore": 25,
      "status": "needs_work",
      "analysis": "工作经历描述存在以下问题...",
      "issues": ["缺少量化数据", "描述过于笼统"],
      "suggestions": ["添加具体数字和成果", "使用STAR法则重新组织"]
    },
    {
      "name": "项目经验",
      "score": 10,
      "maxScore": 15,
      "status": "good",
      "analysis": "项目经验描述...",
      "issues": ["可以更详细"],
      "suggestions": ["补充技术细节"]
    },
    {
      "name": "专业技能",
      "score": 8,
      "maxScore": 10,
      "status": "good",
      "analysis": "技能列表...",
      "issues": [],
      "suggestions": []
    }
  ],
  "issues": [
    {
      "id": "issue_1",
      "type": "critical",
      "category": "基本信息",
      "title": "缺少联系方式",
      "description": "简历中没有找到邮箱地址",
      "location": "顶部个人信息",
      "fixSuggestion": "添加专业邮箱，如 name@example.com",
      "impact": "high"
    }
  ],
  "quickWins": [
    {
      "id": "qw_1",
      "title": "添加量化数据",
      "description": "在工作经历中添加具体数字",
      "effort": "easy",
      "impact": "high",
      "beforeExample": "负责用户增长",
      "afterExample": "主导用户增长，3个月增长400%"
    }
  ],
  "detailedAnalysis": "这是一份...的简历。主要优点是...，需要改进的地方是..."
}

诊断标准：
- grade: A(90+), B(80-89), C(70-79), D(60-69), F(<60)
- status: excellent(>=85%), good(>=70%), needs_work(>=50%), critical(<50%)
- type: critical(严重问题), warning(警告), suggestion(建议)
- impact: high(高影响), medium(中等), low(低)
- effort: easy(简单), medium(中等), hard(复杂)

请仔细分析简历的每个部分，找出所有问题，并提供具体可行的建议。`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, resume, action, targetJob, jobDescription } = body

    if (action === 'score' && resume) {
      return handleScoring(resume, targetJob)
    }

    if (action === 'diagnose' && resume) {
      return handleDiagnosis(resume, targetJob)
    }

    if (action === 'match' && resume && jobDescription) {
      return handleJobMatch(resume, jobDescription, targetJob)
    }

    if (action === 'interview' && resume) {
      return handleInterview(messages, resume, targetJob)
    }

    return handleChat(messages, resume)
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    }, { status: 500 })
  }
}

async function handleChat(messages: any[], resume: string) {
  const messagesForAPI = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content
    }))
  ]

  if (resume) {
    messagesForAPI.push({
      role: 'system',
      content: `当前已生成的简历内容：\n${resume}\n\n请在此基础上继续优化或补充。`
    })
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messagesForAPI,
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('DeepSeek API Error:', JSON.stringify(errorData, null, 2))
    const errorMessage = errorData?.error?.message || errorData?.message || 'AI服务暂时不可用'
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: errorData
    }, { status: 500 })
  }

  const data = await response.json()
  const assistantMessage = data.choices[0]?.message?.content || '抱歉，我没有理解你的意思，请再说一次。'

  let newResume = resume
  if (assistantMessage.includes('---简历开始---') && assistantMessage.includes('---简历结束---')) {
    const resumeMatch = assistantMessage.match(/---简历开始---([\s\S]*?)---简历结束---/)
    if (resumeMatch) {
      newResume = resumeMatch[1].trim()
    }
  }

  return NextResponse.json({
    success: true,
    message: assistantMessage,
    resume: newResume
  })
}

async function handleScoring(resume: string, targetJob: string) {
  const prompt = SCORING_PROMPT
    .replace('{resume}', resume)
    .replace('{targetJob}', targetJob || '通用岗位')

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位专业的简历评审专家。请严格按照JSON格式返回评分结果，不要包含任何其他文字。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('DeepSeek API Error:', errorData)
    return NextResponse.json({ 
      success: false, 
      error: '评分服务暂时不可用' 
    }, { status: 500 })
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const scoreResult = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        success: true,
        score: scoreResult
      })
    }
  } catch (e) {
    console.error('JSON Parse Error:', e)
  }

  return NextResponse.json({ 
    success: false, 
    error: '评分解析失败' 
  }, { status: 500 })
}

async function handleJobMatch(resume: string, jobDescription: string, targetJob: string) {
  const prompt = JOB_MATCH_PROMPT
    .replace('{resume}', resume)
    .replace('{jobDescription}', jobDescription)
    .replace('{targetJob}', targetJob || '目标岗位')

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位专业的职业顾问。请严格按照JSON格式返回匹配分析结果，不要包含任何其他文字。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('DeepSeek API Error:', errorData)
    return NextResponse.json({ 
      success: false, 
      error: '匹配分析服务暂时不可用' 
    }, { status: 500 })
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const matchResult = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        success: true,
        match: matchResult
      })
    }
  } catch (e) {
    console.error('JSON Parse Error:', e)
  }

  return NextResponse.json({ 
    success: false, 
    error: '匹配分析解析失败' 
  }, { status: 500 })
}

async function handleInterview(messages: any[], resume: string, targetJob: string) {
  const systemPrompt = INTERVIEW_PROMPT
    .replace('{resume}', resume)
    .replace('{targetJob}', targetJob || '目标岗位')

  const messagesForAPI = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content
    }))
  ]

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messagesForAPI,
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('DeepSeek API Error:', errorData)
    return NextResponse.json({ 
      success: false, 
      error: '面试服务暂时不可用' 
    }, { status: 500 })
  }

  const data = await response.json()
  const assistantMessage = data.choices[0]?.message?.content || '抱歉，请再说一次。'

  let feedback = null
  let completed = false

  if (assistantMessage.includes('---面试反馈---') && assistantMessage.includes('---面试反馈结束---')) {
    const feedbackMatch = assistantMessage.match(/---面试反馈---([\s\S]*?)---面试反馈结束---/)
    if (feedbackMatch) {
      try {
        feedback = JSON.parse(feedbackMatch[1].trim())
        completed = true
      } catch (e) {
        console.error('Feedback JSON Parse Error:', e)
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: assistantMessage.replace(/---面试反馈---[\s\S]*?---面试反馈结束---/, '').trim(),
    completed,
    feedback
  })
}

async function handleDiagnosis(resume: string, targetJob: string) {
  const prompt = DIAGNOSIS_PROMPT
    .replace('{resume}', resume)
    .replace('{targetJob}', targetJob || '通用岗位')

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位专业的简历诊断专家。请严格按照JSON格式返回诊断结果，不要包含任何其他文字。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2500
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('DeepSeek API Error:', errorData)
    return NextResponse.json({ 
      success: false, 
      error: '诊断服务暂时不可用' 
    }, { status: 500 })
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const diagnosisResult = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        success: true,
        diagnosis: diagnosisResult
      })
    }
  } catch (e) {
    console.error('JSON Parse Error:', e)
  }

  return NextResponse.json({ 
    success: false, 
    error: '诊断解析失败' 
  }, { status: 500 })
}
