'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User, SavedResume, getCurrentUser, setCurrentUser, loginUser, registerUser, logoutUser, getUserResumes, createResume, updateResume, deleteResume, getResumeById } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isSupabaseConfigured: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  resumes: SavedResume[]
  loadResumes: () => void
  saveResume: (title: string, content: string, template: string) => Promise<SavedResume | null>
  updateResumeData: (id: string, title: string, content: string, template: string) => Promise<SavedResume | null>
  deleteResumeById: (id: string) => Promise<boolean>
  getResume: (id: string) => SavedResume | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resumes, setResumes] = useState<SavedResume[]>([])

  useEffect(() => {
    if (isSupabaseConfigured) {
      initSupabaseAuth()
    } else {
      initLocalAuth()
    }
  }, [])

  const initSupabaseAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          createdAt: session.user.created_at
        }
        setUser(userData)
        await loadSupabaseResumes()
      }
      
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            createdAt: session.user.created_at
          }
          setUser(userData)
          await loadSupabaseResumes()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setResumes([])
        }
      })
    } catch (error) {
      console.error('Supabase auth init error:', error)
      initLocalAuth()
    } finally {
      setIsLoading(false)
    }
  }

  const initLocalAuth = () => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setResumes(getUserResumes(currentUser.id))
    }
    setIsLoading(false)
  }

  const loadSupabaseResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      
      const savedResumes: SavedResume[] = (data || []).map(r => ({
        id: r.id,
        userId: r.user_id,
        title: r.title,
        content: r.content,
        template: r.template,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        version: 1
      }))
      
      setResumes(savedResumes)
    } catch (error) {
      console.error('Load resumes error:', error)
    }
  }

  const loadResumes = () => {
    if (isSupabaseConfigured && user) {
      loadSupabaseResumes()
    } else if (user) {
      setResumes(getUserResumes(user.id))
    }
  }

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) {
          return { success: false, error: getErrorMessage(error.message) }
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: '登录失败，请重试' }
      }
    } else {
      const result = loginUser(email, password)
      if (result.success && result.user) {
        setUser(result.user)
        setResumes(getUserResumes(result.user.id))
      }
      return result
    }
  }

  const register = async (email: string, name: string, password: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        })
        
        if (error) {
          return { success: false, error: getErrorMessage(error.message) }
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: '注册失败，请重试' }
      }
    } else {
      const result = registerUser(email, name, password)
      if (result.success && result.user) {
        setCurrentUser(result.user)
        setUser(result.user)
        setResumes([])
      }
      return result
    }
  }

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      logoutUser()
    }
    setUser(null)
    setResumes([])
  }

  const saveResume = async (title: string, content: string, template: string): Promise<SavedResume | null> => {
    if (!user) return null
    
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title,
            content,
            template
          })
          .select()
          .single()
        
        if (error) throw error
        
        const newResume: SavedResume = {
          id: data.id,
          userId: data.user_id,
          title: data.title,
          content: data.content,
          template: data.template,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          version: 1
        }
        
        setResumes(prev => [newResume, ...prev])
        return newResume
      } catch (error) {
        console.error('Save resume error:', error)
        return null
      }
    } else {
      const newResume = createResume(user.id, title, content, template)
      setResumes(prev => [newResume, ...prev])
      return newResume
    }
  }

  const updateResumeData = async (id: string, title: string, content: string, template: string): Promise<SavedResume | null> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .update({ title, content, template })
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        
        const updated: SavedResume = {
          id: data.id,
          userId: data.user_id,
          title: data.title,
          content: data.content,
          template: data.template,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          version: 1
        }
        
        setResumes(prev => prev.map(r => r.id === id ? updated : r))
        return updated
      } catch (error) {
        console.error('Update resume error:', error)
        return null
      }
    } else {
      const updated = updateResume(id, title, content, template)
      if (updated) {
        setResumes(prev => prev.map(r => r.id === id ? updated : r))
      }
      return updated
    }
  }

  const deleteResumeById = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('resumes')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        setResumes(prev => prev.filter(r => r.id !== id))
        return true
      } catch (error) {
        console.error('Delete resume error:', error)
        return false
      }
    } else {
      const success = deleteResume(id)
      if (success) {
        setResumes(prev => prev.filter(r => r.id !== id))
      }
      return success
    }
  }

  const getResume = (id: string): SavedResume | null => {
    return resumes.find(r => r.id === id) || getResumeById(id)
  }

  const getErrorMessage = (message: string): string => {
    if (message.includes('Invalid login credentials')) {
      return '邮箱或密码错误'
    }
    if (message.includes('Email not confirmed')) {
      return '请先验证邮箱'
    }
    if (message.includes('already registered')) {
      return '该邮箱已被注册'
    }
    if (message.includes('Password')) {
      return '密码至少需要6个字符'
    }
    return message || '操作失败，请重试'
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isSupabaseConfigured,
      login,
      register,
      logout,
      resumes,
      loadResumes,
      saveResume,
      updateResumeData,
      deleteResumeById,
      getResume
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
