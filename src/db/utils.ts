/**
 * @fileoverview
 * utility functions for working with data transformations related to the database,
 * but notably do NOT involve actually interfacing with the database.
 */

import type { Entry, Mood, MoodId } from './types.ts'

export async function base64ToUrl(base64Str: string) {
  return blobToUrl(await base64ToBlob(base64Str))
}

export async function urlToBase64(url: string) {
  return blobToBase64((await urlToBlob(url))!)
}

export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('loadend', () => resolve(reader.result as string))
    reader.addEventListener('error', reject)
    reader.readAsDataURL(blob)
  })
}

export async function base64ToBlob(base64Str: string) {
  const data = await fetch(base64Str)
  const blob = await data.blob()
  return blob
}

/**
 * fetches an image from a url and returns the image blob, or `null` if it fails
 */
export async function urlToBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('Error fetching image as Blob:', error)
    return null
  }
}

/**
 * gets a url to an image blob
 */
export function blobToUrl(blob: Blob) {
  const url = URL.createObjectURL(blob)
  return url
}

export async function createMood(color: string, image: Blob, id?: string): Promise<Mood> {
  if (id === undefined) {
    id = generateId()
  }
  return {
    id,
    color,
    image: await blobToBase64(image),
  }
}

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
    id: generateId(),
    moodId: moodId,
    description,
    date: serializeDateForEntry(date),
    timestamp: date.getTime(),
  }

  return entry
}

export function serializeDateForEntry(date: Date): `${number}.${number}.${number}` {
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

export type ExpandedMood = Omit<Mood, 'image'> & {
  imageUrl: string
}

export type ExpandedEntry = Omit<Entry, 'moodId' | 'timestamp' | 'image'> & {
  mood: ExpandedMood
  timestamp: Date
}

export async function expandMood(mood: Mood): Promise<ExpandedMood> {
  const { image, ...rest } = mood
  const blob = await base64ToBlob(image)
  const imageUrl = blobToUrl(blob)
  return { ...rest, imageUrl }
}

/**
 * expands a virtual db Entry into its full form,
 * with the mood id replaced with the mood it resolves to,
 * and the timestamp read back into a Date object, rather than the number representation of a date.
 *
 * if the entry's mood id is not found in the map of moods, returns `null`.
 */
export async function expandEntry(
  entry: Entry,
  moodIdToMood: Map<Mood['id'], Mood>,
): Promise<ExpandedEntry | null> {
  const { moodId, timestamp, ...rest } = entry
  if (!moodIdToMood.has(moodId)) {
    return null
  }
  return {
    ...rest,
    mood: await expandMood(moodIdToMood.get(moodId)!),
    timestamp: new Date(timestamp),
  }
}

/**
 * generates a random id
 */
export function generateId() {
  return window.crypto.randomUUID()
}