import { useCallback, useEffect, useRef } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

export function useNotifications() {
  const notificationsEnabled = useSettingsStore(s => s.notifications)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Request notification permission on mount
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission()
    }

    // Create audio element for notification sound
    audioRef.current = new Audio('/sounds/notification.mp3')
    audioRef.current.volume = 0.5

    return () => {
      audioRef.current = null
    }
  }, [])

  const showNotification = useCallback((title: string, body: string) => {
    if (!notificationsEnabled) return

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'tamata-timer',
        requireInteraction: true
      })
    }
  }, [notificationsEnabled])

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Audio play failed, user hasn't interacted yet
      })
    }
  }, [])

  return { showNotification, playNotificationSound }
}
