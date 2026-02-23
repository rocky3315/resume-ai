'use client'

import { ResumeData } from '@/lib/templates'

export function exportToMarkdown(resume: string): void {
  const markdown = `# 我的简历\n\n${resume.split('\n').map(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
      return `\n## ${trimmed.replace(/【|】/g, '')}\n`
    }
    if (trimmed.startsWith('-')) {
      return `* ${trimmed.substring(1).trim()}\n`
    }
    return `${trimmed}\n`
  }).join('')}`
  
  downloadFile(markdown, '我的简历.md', 'text/markdown')
}

export function exportToWord(data: ResumeData, templateName: string): void {
  const html = generateWordHTML(data, templateName)
  
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '我的简历.doc'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToHTML(data: ResumeData, templateName: string): void {
  const html = generateFullHTML(data, templateName)
  downloadFile(html, '我的简历.html', 'text/html')
}

export function exportToJSON(data: ResumeData): void {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, '我的简历.json', 'application/json')
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function generateWordHTML(data: ResumeData, templateName: string): string {
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${data.name || '我的简历'}</title>
      <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; padding: 20px; }
        h1 { font-size: 24pt; text-align: center; margin-bottom: 10px; }
        h2 { font-size: 14pt; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 20px; }
        .contact { text-align: center; color: #666; margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .item { margin-bottom: 10px; }
        .item-header { display: flex; justify-content: space-between; }
        .item-title { font-weight: bold; }
        .item-date { color: #666; }
        .item-subtitle { color: #444; margin-bottom: 5px; }
        ul { margin: 5px 0; padding-left: 20px; }
        li { margin-bottom: 3px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>${data.name || '您的姓名'}</h1>
      <div class="contact">
        ${data.phone ? `电话: ${data.phone}` : ''}
        ${data.phone && data.email ? ' | ' : ''}
        ${data.email ? `邮箱: ${data.email}` : ''}
      </div>
      
      ${data.summary ? `
        <div class="section">
          <h2>个人简介</h2>
          <p>${data.summary}</p>
        </div>
      ` : ''}
      
      ${data.education.length > 0 ? `
        <div class="section">
          <h2>教育背景</h2>
          ${data.education.map(edu => `
            <div class="item">
              <div class="item-header">
                <span class="item-title">${edu.school}</span>
                <span class="item-date">${edu.time}</span>
              </div>
              <div class="item-subtitle">${edu.major} | ${edu.degree}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.experience.length > 0 ? `
        <div class="section">
          <h2>工作经历</h2>
          ${data.experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <span class="item-title">${exp.company}</span>
                <span class="item-date">${exp.time}</span>
              </div>
              <div class="item-subtitle">${exp.position}</div>
              ${exp.achievements.length > 0 ? `
                <ul>
                  ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.projects.length > 0 ? `
        <div class="section">
          <h2>项目经验</h2>
          ${data.projects.map(project => `
            <div class="item">
              <div class="item-header">
                <span class="item-title">${project.name}</span>
                <span class="item-date">${project.time}</span>
              </div>
              <div class="item-subtitle">${project.role}</div>
              <p>${project.description}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.skills.length > 0 ? `
        <div class="section">
          <h2>专业技能</h2>
          <div class="skills">
            ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `
}

function generateFullHTML(data: ResumeData, templateName: string): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name || '我的简历'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f5f5f5;
    }
    .resume { background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { font-size: 28px; text-align: center; margin-bottom: 10px; }
    .contact { text-align: center; color: #666; margin-bottom: 30px; }
    h2 { font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin: 30px 0 15px; color: #1e40af; }
    .item { margin-bottom: 20px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .item-title { font-weight: 600; font-size: 16px; }
    .item-date { color: #666; font-size: 14px; }
    .item-subtitle { color: #555; margin: 5px 0; }
    ul { margin: 10px 0; padding-left: 25px; }
    li { margin-bottom: 5px; color: #444; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
    .summary { color: #555; line-height: 1.8; }
    @media print {
      body { background: white; padding: 0; }
      .resume { box-shadow: none; padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="resume">
    <h1>${data.name || '您的姓名'}</h1>
    <div class="contact">
      ${data.phone ? `📞 ${data.phone}` : ''}
      ${data.phone && data.email ? ' · ' : ''}
      ${data.email ? `✉️ ${data.email}` : ''}
    </div>
    
    ${data.summary ? `
      <section>
        <h2>个人简介</h2>
        <p class="summary">${data.summary}</p>
      </section>
    ` : ''}
    
    ${data.education.length > 0 ? `
      <section>
        <h2>教育背景</h2>
        ${data.education.map(edu => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${edu.school}</span>
              <span class="item-date">${edu.time}</span>
            </div>
            <div class="item-subtitle">${edu.major} | ${edu.degree}</div>
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    ${data.experience.length > 0 ? `
      <section>
        <h2>工作经历</h2>
        ${data.experience.map(exp => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${exp.company}</span>
              <span class="item-date">${exp.time}</span>
            </div>
            <div class="item-subtitle">${exp.position}</div>
            ${exp.achievements.length > 0 ? `
              <ul>
                ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    ${data.projects.length > 0 ? `
      <section>
        <h2>项目经验</h2>
        ${data.projects.map(project => `
          <div class="item">
            <div class="item-header">
              <span class="item-title">${project.name}</span>
              <span class="item-date">${project.time}</span>
            </div>
            <div class="item-subtitle">${project.role}</div>
            <p>${project.description}</p>
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    ${data.skills.length > 0 ? `
      <section>
        <h2>专业技能</h2>
        <div class="skills">
          ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
      </section>
    ` : ''}
  </div>
</body>
</html>
  `
}
