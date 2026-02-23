import { useEffect, useRef, useCallback } from 'react'

interface AutoSaveData {
  resume: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  template: string
  targetJob: string
  timestamp: number
}

const STORAGE_KEY = 'resume-ai-autosave'
const SAVE_INTERVAL = 30000 // 30秒自动保存一次

export function useAutoSave(
  resume: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  template: string,
  targetJob: string
) {
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const save = useCallback(() => {
    if (!resume && messages.length <= 1) return

    const data: AutoSaveData = {
      resume,
      messages,
      template,
      targetJob,
      timestamp: Date.now()
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      console.log('Auto saved at', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Auto save failed:', error)
    }
  }, [resume, messages, template, targetJob])

  const load = useCallback((): AutoSaveData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Load auto save failed:', error)
    }
    return null
  }, [])

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Clear auto save failed:', error)
    }
  }, [])

  // Auto save every 30 seconds
  useEffect(() => {
    saveTimerRef.current = setInterval(save, SAVE_INTERVAL)

    return () => {
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current)
      }
    }
  }, [save])

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      save()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [save])

  return { save, load, clear }
}
