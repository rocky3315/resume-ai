export interface TranslationResult {
  success: boolean
  translatedContent?: string
  error?: string
}

export function translateResumeToEnglish(resumeContent: string): Promise<TranslationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const translations: Record<string, string> = {
        '【姓名】': '[Name]',
        '【个人简介】': '[Summary]',
        '【教育背景】': '[Education]',
        '【工作经历】': '[Work Experience]',
        '【项目经验】': '[Projects]',
        '【专业技能】': '[Skills]',
        '电话：': 'Phone: ',
        '邮箱：': 'Email: ',
        '学校': 'University',
        '专业': 'Major',
        '学历': 'Degree',
        '时间': 'Period',
        '公司': 'Company',
        '职位': 'Position',
        '项目': 'Project',
        '角色': 'Role',
        '描述': 'Description'
      }
      
      let translated = resumeContent
      Object.entries(translations).forEach(([chinese, english]) => {
        translated = translated.replace(new RegExp(chinese, 'g'), english)
      })
      
      resolve({
        success: true,
        translatedContent: translated
      })
    }, 500)
  })
}
