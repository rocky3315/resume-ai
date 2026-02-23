export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface SavedResume {
  id: string
  userId: string
  title: string
  content: string
  template: string
  createdAt: string
  updatedAt: string
  version: number
}

export interface ResumeVersion {
  id: string
  resumeId: string
  content: string
  template: string
  version: number
  createdAt: string
  note?: string
}

const USERS_KEY = 'resume_ai_users'
const CURRENT_USER_KEY = 'resume_ai_current_user'
const RESUMES_KEY = 'resume_ai_resumes'
const VERSIONS_KEY = 'resume_ai_versions'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(CURRENT_USER_KEY)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function registerUser(email: string, name: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: '该邮箱已被注册' }
  }
  
  const newUser: User = {
    id: generateId(),
    email,
    name,
    createdAt: new Date().toISOString()
  }
  
  const passwordKey = `resume_ai_password_${newUser.id}`
  localStorage.setItem(passwordKey, password)
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, user: newUser }
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  const user = users.find(u => u.email === email)
  
  if (!user) {
    return { success: false, error: '用户不存在' }
  }
  
  const passwordKey = `resume_ai_password_${user.id}`
  const storedPassword = localStorage.getItem(passwordKey)
  
  if (storedPassword !== password) {
    return { success: false, error: '密码错误' }
  }
  
  setCurrentUser(user)
  return { success: true, user }
}

export function logoutUser(): void {
  setCurrentUser(null)
}

export function getResumes(): SavedResume[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(RESUMES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveResumes(resumes: SavedResume[]): void {
  localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes))
}

export function getUserResumes(userId: string): SavedResume[] {
  return getResumes().filter(r => r.userId === userId)
}

export function createResume(userId: string, title: string, content: string, template: string): SavedResume {
  const resumes = getResumes()
  const newResume: SavedResume = {
    id: generateId(),
    userId,
    title,
    content,
    template,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  }
  resumes.push(newResume)
  saveResumes(resumes)
  
  createVersion(newResume.id, content, template, 1, '初始版本')
  
  return newResume
}

export function updateResume(id: string, title: string, content: string, template: string, note?: string): SavedResume | null {
  const resumes = getResumes()
  const index = resumes.findIndex(r => r.id === id)
  if (index === -1) return null
  
  const currentResume = resumes[index]
  const newVersion = (currentResume.version || 1) + 1
  
  resumes[index] = {
    ...resumes[index],
    title,
    content,
    template,
    updatedAt: new Date().toISOString(),
    version: newVersion
  }
  saveResumes(resumes)
  
  createVersion(id, content, template, newVersion, note)
  
  return resumes[index]
}

export function getVersions(): ResumeVersion[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(VERSIONS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveVersions(versions: ResumeVersion[]): void {
  localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
}

export function getResumeVersions(resumeId: string): ResumeVersion[] {
  return getVersions().filter(v => v.resumeId === resumeId).sort((a, b) => b.version - a.version)
}

export function createVersion(resumeId: string, content: string, template: string, version: number, note?: string): ResumeVersion {
  const versions = getVersions()
  const newVersion: ResumeVersion = {
    id: generateId(),
    resumeId,
    content,
    template,
    version,
    createdAt: new Date().toISOString(),
    note
  }
  versions.push(newVersion)
  saveVersions(versions)
  return newVersion
}

export function restoreVersion(resumeId: string, versionId: string): SavedResume | null {
  const version = getVersions().find(v => v.id === versionId)
  if (!version) return null
  
  const resumes = getResumes()
  const index = resumes.findIndex(r => r.id === resumeId)
  if (index === -1) return null
  
  const newVersion = (resumes[index].version || 1) + 1
  
  resumes[index] = {
    ...resumes[index],
    content: version.content,
    template: version.template,
    updatedAt: new Date().toISOString(),
    version: newVersion
  }
  saveResumes(resumes)
  
  createVersion(resumeId, version.content, version.template, newVersion, `恢复到版本 ${version.version}`)
  
  return resumes[index]
}

export function deleteVersion(versionId: string): boolean {
  const versions = getVersions()
  const index = versions.findIndex(v => v.id === versionId)
  if (index === -1) return false
  
  versions.splice(index, 1)
  saveVersions(versions)
  return true
}

export function deleteResume(id: string): boolean {
  const resumes = getResumes()
  const index = resumes.findIndex(r => r.id === id)
  if (index === -1) return false
  
  resumes.splice(index, 1)
  saveResumes(resumes)
  return true
}

export function getResumeById(id: string): SavedResume | null {
  return getResumes().find(r => r.id === id) || null
}
