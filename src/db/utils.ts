/**
 * @fileoverview
 * utility functions for working with data transformations related to the database,
 * but notably do NOT involve actually interfacing with the database.
 */

import type { Entry, Mood, MoodId } from './types.ts'

/**
 * create a virtual entry with the given mood id, description, and date.
 *
 * if the date is left unspecified, defaults to the current time.
 *
 * note: this does NOT create the entry in the database, only an entry object in memory.
 */
export function createEntry(
  moodId: MoodId,
  description: string,
  date?: Date,
): Entry {
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

export type RevivedEntry = Omit<Entry, 'moodId' | 'timestamp'> & {
  mood: Mood
  timestamp: Date
}

/**
 * "revives" a virtual db Entry into its full form,
 * with the mood id replaced with the mood it resolves to,
 * and the timestamp read back into a Date object, rather than the number representation of a date.
 *
 * useful for converting entries read from the database back into "full form".
 *
 * if the entry's mood id is not found in the map of moods, returns `null`.
 */
export function reviveEntry(
  entry: Entry,
  moodIdToMood: Map<Mood['id'], Mood>,
): RevivedEntry | null {
  const { moodId, timestamp, ...rest } = entry
  if (!moodIdToMood.has(moodId)) {
    return null
  }
  return {
    ...rest,
    mood: moodIdToMood.get(moodId)!,
    timestamp: new Date(timestamp),
  }
}
