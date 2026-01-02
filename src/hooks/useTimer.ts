import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useAnalyticsStore } from '../stores/analyticsStore'
import { useNotifications } from './useNotifications'

export function useTimer() {
  const workerRef = useRef<Worker | null>(null)
  const startTimeRef = useRef<number>(0)

  const {
    mode,
    status,
    timeRemaining,
    currentSession,
    totalSessions,
    start,
    pause,
    reset,
    skip,
    tick,
    complete,
    setMode,
    getDurationForMode
  } = useTimerStore()

  const settings = useSettingsStore()
  const { recordSession } = useAnalyticsStore()
  const { showNotification, playNotificationSound } = useNotifications()

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = (e) => {
      const { type } = e.data

      if (type === 'tick') {
        tick()
      } else if (type === 'complete') {
        handleComplete()
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const handleComplete = useCallback(async () => {
    const currentMode = useTimerStore.getState().mode
    const duration = getDurationForMode(currentMode)

    // Record session
    await recordSession(currentMode, duration, false)

    // Show notification
    playNotificationSound()
    if (currentMode === 'work') {
      showNotification('Work session complete!', 'Time for a break.')
    } else {
      showNotification('Break is over!', 'Ready to focus?')
    }

    // Transition to next mode
    complete()
  }, [recordSession, showNotification, playNotificationSound, complete, getDurationForMode])

  // Handle status changes
  useEffect(() => {
    if (!workerRef.current) return

    if (status === 'running') {
      startTimeRef.current = Date.now()
      workerRef.current.postMessage({
        type: 'start',
        payload: { duration: timeRemaining }
      })
    } else if (status === 'paused') {
      workerRef.current.postMessage({ type: 'pause' })
    } else if (status === 'idle') {
      workerRef.current.postMessage({
        type: 'reset',
        payload: { duration: timeRemaining }
      })
    }
  }, [status])

  // Handle mode changes - reset timer
  useEffect(() => {
    const duration = getDurationForMode(mode)
    if (workerRef.current && status === 'idle') {
      workerRef.current.postMessage({
        type: 'sync',
        payload: { remaining: duration }
      })
    }
  }, [mode, settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration])

  const toggle = useCallback(() => {
    if (status === 'running') {
      pause()
    } else {
      start()
    }
  }, [status, start, pause])

  const interrupt = useCallback(async () => {
    if (status === 'running') {
      const currentMode = useTimerStore.getState().mode
      const fullDuration = getDurationForMode(currentMode)
      const elapsed = fullDuration - timeRemaining

      // Only record if significant time passed (> 60 seconds)
      if (elapsed > 60) {
        await recordSession(currentMode, elapsed, true)
      }
    }
    reset()
  }, [status, timeRemaining, recordSession, reset, getDurationForMode])

  return {
    mode,
    status,
    timeRemaining,
    currentSession,
    totalSessions,
    toggle,
    reset: interrupt,
    skip,
    setMode,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isIdle: status === 'idle',
    progress: 1 - timeRemaining / getDurationForMode(mode)
  }
}
