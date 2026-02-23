import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const PARSE_PROMPT = `你是一个简历解析专家。请从以下简历文本中提取结构化信息。

简历文本：
{resumeText}

请严格按照以下JSON格式返回解析结果，确保JSON格式正确：
{
  "name": "姓名",
  "phone": "手机号码",
  "email": "邮箱地址",
  "summary": "个人简介",
  "education": [
    {"school": "学校", "major": "专业", "degree": "学历", "time": "时间"}
  ],
  "experience": [
    {"company": "公司", "position": "职位", "time": "时间", "achievements": ["成就1", "成就2"]}
  ],
  "projects": [
    {"name": "项目名", "role": "角色", "time": "时间", "description": "描述"}
  ],
  "skills": ["技能1", "技能2"]
}

重要规则：
1. 只返回JSON，不要有任何其他文字
2. 确保所有字符串都用双引号
3. 数组元素之间用逗号分隔
4. 如果某个字段无法识别，使用空字符串或空数组
5. 电话只保留数字
6. 工作成就要简短，每条不超过50字
7. 技能要具体，如"Python"、"项目管理"等`

function repairJSON(str: string): string {
  let result = str
  
  result = result.replace(/,\s*}/g, '}')
  result = result.replace(/,\s*]/g, ']')
  result = result.replace(/}\s*{/g, '},{')
  
  result = result.replace(/"achievements":\s*"([^"]*)"/g, '"achievements":["$1"]')
  
  result = result.replace(/\n/g, '\\n')
  result = result.replace(/\t/g, '\\t')
  
  return result
}

function extractPartialData(text: string): any {
  const data: any = {
    name: '',
    phone: '',
    email: '',
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: []
  }
  
  const nameMatch = text.match(/"name"\s*:\s*"([^"]*)"/)
  if (nameMatch) data.name = nameMatch[1]
  
  const phoneMatch = text.match(/"phone"\s*:\s*"([^"]*)"/)
  if (phoneMatch) data.phone = phoneMatch[1]
  
  const emailMatch = text.match(/"email"\s*:\s*"([^"]*)"/)
  if (emailMatch) data.email = emailMatch[1]
  
  const summaryMatch = text.match(/"summary"\s*:\s*"([^"]*)"/)
  if (summaryMatch) data.summary = summaryMatch[1]
  
  return data
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || text.length < 50) {
      return NextResponse.json({ 
        success: false, 
        error: '简历内容太少' 
      }, { status: 400 })
    }

    const prompt = PARSE_PROMPT.replace('{resumeText}', text.substring(0, 6000))

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
            content: '你是一个专业的简历解析助手。你必须只返回有效的JSON格式，不要包含任何其他文字或解释。' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 2500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('DeepSeek API Error:', JSON.stringify(errorData, null, 2))
      return NextResponse.json({ 
        success: false, 
        error: 'AI解析服务暂时不可用' 
      }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    console.log('AI Response length:', content.length)

    try {
      let jsonStr = content
      
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      }
      
      jsonStr = repairJSON(jsonStr)
      
      try {
        const parsedData = JSON.parse(jsonStr)
        return NextResponse.json({
          success: true,
          data: parsedData
        })
      } catch (e) {
        console.log('First parse failed, trying to extract partial data')
        
        const partialData = extractPartialData(content)
        
        if (partialData.name || partialData.phone || partialData.email) {
          return NextResponse.json({
            success: true,
            data: partialData
          })
        }
        
        throw e
      }
    } catch (e) {
      console.error('JSON Parse Error:', e)
      
      return NextResponse.json({ 
        success: false, 
        error: '解析结果格式错误，请尝试简化简历内容后重新上传' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Parse API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '服务器错误' 
    }, { status: 500 })
  }
}
