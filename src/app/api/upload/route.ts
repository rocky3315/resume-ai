import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: '请选择文件' 
      }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const fileSize = file.size
    
    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: '文件大小不能超过10MB' 
      }, { status: 400 })
    }

    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt']
    const fileExt = fileName.substring(fileName.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExt)) {
      return NextResponse.json({ 
        success: false, 
        error: '支持的格式：PDF、Word(.doc/.docx)、TXT' 
      }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (fileExt === '.pdf') {
      text = await parsePDF(buffer)
    } else if (fileExt === '.docx' || fileExt === '.doc') {
      text = await parseWord(buffer)
    } else if (fileExt === '.txt') {
      text = buffer.toString('utf-8')
    }

    text = text.trim()
    
    if (text.length < 50) {
      return NextResponse.json({ 
        success: false, 
        error: '文件内容太少，请上传完整的简历' 
      }, { status: 400 })
    }

    if (text.length > 10000) {
      text = text.substring(0, 10000) + '\n...(内容已截断)'
    }

    return NextResponse.json({
      success: true,
      text,
      fileName: file.name,
      charCount: text.length
    })

  } catch (error) {
    console.error('File parse error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '文件解析失败，请检查文件格式' 
    }, { status: 500 })
  }
}

async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error('PDF parse error:', error)
    throw new Error('PDF解析失败')
  }
}

async function parseWord(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error('Word parse error:', error)
    throw new Error('Word文档解析失败')
  }
}
