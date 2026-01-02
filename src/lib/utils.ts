import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function getWeekDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
