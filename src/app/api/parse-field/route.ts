import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, field } = body

    if (!text) {
      return NextResponse.json({ 
        success: false, 
        error: '缺少文本内容' 
      }, { status: 400 })
    }

    const prompts: Record<string, string> = {
      name: `从以下简历文本中提取姓名。只返回姓名，不要其他任何内容。
简历文本：
{text}`,
      
      phone: `从以下简历文本中提取手机号码。只返回手机号码（纯数字），不要其他任何内容。
简历文本：
{text}`,
      
      email: `从以下简历文本中提取邮箱地址。只返回邮箱，不要其他任何内容。
简历文本：
{text}`,
      
      summary: `从以下简历文本中提取个人简介或自我评价。只返回简介内容，不要其他任何内容。如果没有则返回空。
简历文本：
{text}`,
      
      education: `从以下简历文本中提取教育背景信息。
返回JSON数组格式：[{"school":"学校","major":"专业","degree":"学历","time":"时间"}]
只返回JSON数组，不要其他任何内容。
简历文本：
{text}`,
      
      experience: `从以下简历文本中提取工作经历信息。
返回JSON数组格式：[{"company":"公司","position":"职位","time":"时间","achievements":["成就1","成就2"]}]
只返回JSON数组，不要其他任何内容。每条成就不超过30字。
简历文本：
{text}`,
      
      projects: `从以下简历文本中提取项目经验信息。
返回JSON数组格式：[{"name":"项目名","role":"角色","time":"时间","description":"描述"}]
只返回JSON数组，不要其他任何内容。描述不超过50字。
简历文本：
{text}`,
      
      skills: `从以下简历文本中提取专业技能。
返回JSON数组格式：["技能1","技能2","技能3"]
只返回JSON数组，不要其他任何内容。每个技能不超过10字。
简历文本：
{text}`
    }

    const prompt = prompts[field] || prompts.name
    const finalPrompt = prompt.replace('{text}', text.substring(0, 4000))

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: '你是一个简历解析助手。严格按照要求返回结果，不要添加任何解释或额外文字。' 
          },
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1000
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
    let content = data.choices[0]?.message?.content || ''
    
    content = content.trim()
    
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1)
    }

    if (['education', 'experience', 'projects', 'skills'].includes(field)) {
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return NextResponse.json({
            success: true,
            data: parsed
          })
        }
      } catch (e) {
        console.error('JSON parse error:', e)
      }
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    return NextResponse.json({
      success: true,
      data: content
    })

  } catch (error) {
    console.error('Parse field API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    }, { status: 500 })
  }
}
