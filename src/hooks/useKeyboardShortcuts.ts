import { useEffect } from 'react'
import { useTimer } from './useTimer'

export function useKeyboardShortcuts() {
  const { toggle, reset, skip, isRunning } = useTimer()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          toggle()
          break
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            reset()
          }
          break
        case 'KeyS':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            skip()
          }
          break
        case 'Escape':
          if (isRunning) {
            toggle()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle, reset, skip, isRunning])
}
