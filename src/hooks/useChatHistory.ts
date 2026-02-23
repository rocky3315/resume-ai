import { useState, useEffect, useCallback } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'resume-ai-chat-history'
const MAX_SESSIONS = 10
const MAX_MESSAGES_PER_SESSION = 50

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSessions(parsed.sessions || [])
        setCurrentSessionId(parsed.currentSessionId || null)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }, [])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessions,
        currentSessionId
      }))
    } catch (error) {
      console.error('Failed to save chat history:', error)
    }
  }, [sessions, currentSessionId])

  const createSession = useCallback((title: string = '新对话') => {
    const newSession: ChatSession = {
      id: Date.now().toString(36),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    setSessions(prev => {
      const updated = [newSession, ...prev].slice(0, MAX_SESSIONS)
      return updated
    })
    setCurrentSessionId(newSession.id)
    return newSession.id
  }, [])

  const addMessage = useCallback((sessionId: string, message: ChatMessage) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedMessages = [...session.messages, message].slice(-MAX_MESSAGES_PER_SESSION)
        return {
          ...session,
          messages: updatedMessages,
          updatedAt: Date.now()
        }
      }
      return session
    }))
  }, [])

  const getCurrentSession = useCallback(() => {
    return sessions.find(s => s.id === currentSessionId) || null
  }, [sessions, currentSessionId])

  const switchSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId)
  }, [])

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
    }
  }, [currentSessionId])

  const clearAllSessions = useCallback(() => {
    setSessions([])
    setCurrentSessionId(null)
  }, [])

  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, title }
      }
      return session
    }))
  }, [])

  return {
    sessions,
    currentSessionId,
    currentSession: getCurrentSession(),
    createSession,
    addMessage,
    switchSession,
    deleteSession,
    clearAllSessions,
    updateSessionTitle
  }
}
