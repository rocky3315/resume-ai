import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SYSTEM_PROMPT = `你是一位专业的简历撰写专家和职业顾问。你的任务是帮助用户生成和优化专业简历。

## 你的能力
1. 通过对话收集用户信息，生成专业简历
2. 根据目标岗位JD优化现有简历
3. 提供职业发展建议

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

export async function POST(request: NextRequest) {
  try {
    const { messages, resume } = await request.json()

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
      console.error('DeepSeek API Error:', errorData)
      return NextResponse.json({ 
        success: false, 
        error: 'AI服务暂时不可用' 
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

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    }, { status: 500 })
  }
}
