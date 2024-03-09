/**
 * @fileoverview
 * utility functions for working with data transformations related to the database,
 * but notably do NOT involve actually interfacing with the database.
 */

import type { Entry, MoodId } from './types.ts'

/**
 * create a virtual entry with the given mood id, description, and date.
 * 
 * if the date is left unspecified, defaults to the current time.
 * 
 * note: this does NOT create the entry in the database, only an entry object in memory.
 */
export function createEntry(moodId: MoodId, description: string, date?: Date): Entry {
  if (date === undefined) {
    date = new Date()
  }

  const entry: Entry = {
    id: window.crypto.randomUUID(),
    moodId: moodId,
    description,
    date: serializeDateForEntry(date),
    timestamp: date.getTime(),
  }

  return entry
}

export function serializeDateForEntry(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}

/**
 * given a number representing a date, returns the numbers representing
 * 00:00:00.000 for that day and 00:00:00.000 the next day
 *
 * TODO: should we make it hardcoded 24 hour range (because timezones can get weird)?
 */
export function getTodayRange(
  timestamp: number,
): [startOfDay: number, startOfNextDay: number] {
  const date = new Date(timestamp)

  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  const startOfDay = date.getTime()

  date.setDate(date.getDate() + 1)
  const startOfNextDay = date.getTime()

  return [startOfDay, startOfNextDay]
}
