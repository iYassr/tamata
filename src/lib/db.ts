import Dexie, { type EntityTable } from 'dexie'
import type { Session, DailyStats, AppSettings } from '../types'

const db = new Dexie('TamataDB') as Dexie & {
  sessions: EntityTable<Session, 'id'>
  dailyStats: EntityTable<DailyStats, 'date'>
  settings: EntityTable<AppSettings & { id: string }, 'id'>
}

db.version(1).stores({
  sessions: 'id, type, completedAt',
  dailyStats: 'date',
  settings: 'id'
})

export { db }

export async function saveSession(session: Session): Promise<void> {
  await db.sessions.add(session)
}

export async function getTodaySessions(): Promise<Session[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return db.sessions
    .where('completedAt')
    .aboveOrEqual(today)
    .toArray()
}

export async function getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
  return db.sessions
    .where('completedAt')
    .between(startDate, endDate, true, true)
    .toArray()
}

export async function getDailyStatsForDate(date: string): Promise<DailyStats | undefined> {
  return db.dailyStats.get(date)
}

export async function saveDailyStats(stats: DailyStats): Promise<void> {
  await db.dailyStats.put(stats)
}

export async function getWeeklyStats(dates: string[]): Promise<DailyStats[]> {
  const stats = await db.dailyStats.bulkGet(dates)
  return stats.filter((s): s is DailyStats => s !== undefined)
}

export async function getAllStats(): Promise<DailyStats[]> {
  return db.dailyStats.toArray()
}
