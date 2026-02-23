export interface SharedResume {
  id: string
  resumeId: string
  userId: string
  shareCode: string
  title: string
  content: string
  template: string
  createdAt: string
  expiresAt?: string
  viewCount: number
}

const SHARED_RESUMES_KEY = 'resume_ai_shared'

function generateShareCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function getSharedResumes(): SharedResume[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(SHARED_RESUMES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveSharedResumes(resumes: SharedResume[]): void {
  localStorage.setItem(SHARED_RESUMES_KEY, JSON.stringify(resumes))
}

export function createShareLink(resumeId: string, userId: string, title: string, content: string, template: string): SharedResume {
  const sharedResumes = getSharedResumes()
  
  const existing = sharedResumes.find(r => r.resumeId === resumeId)
  if (existing) {
    existing.viewCount++
    saveSharedResumes(sharedResumes)
    return existing
  }
  
  const newShare: SharedResume = {
    id: Date.now().toString(36),
    resumeId,
    userId,
    shareCode: generateShareCode(),
    title,
    content,
    template,
    createdAt: new Date().toISOString(),
    viewCount: 0
  }
  
  sharedResumes.push(newShare)
  saveSharedResumes(sharedResumes)
  
  return newShare
}

export function getSharedResumeByCode(shareCode: string): SharedResume | null {
  const sharedResumes = getSharedResumes()
  const shared = sharedResumes.find(r => r.shareCode === shareCode)
  
  if (shared) {
    shared.viewCount++
    saveSharedResumes(sharedResumes)
  }
  
  return shared || null
}

export function deleteShareLink(shareCode: string): boolean {
  const sharedResumes = getSharedResumes()
  const index = sharedResumes.findIndex(r => r.shareCode === shareCode)
  
  if (index === -1) return false
  
  sharedResumes.splice(index, 1)
  saveSharedResumes(sharedResumes)
  return true
}

export function getShareUrl(shareCode: string): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/share/${shareCode}`
}
