import { generateId } from './utils.ts'

import type { Mood, MoodCollection, Settings } from './types.ts'

export const DEFAULT_SETTINGS: Settings = {
  defaultView: 'week',
  remindMe: 'none',
  reminderTimes: 'none',
}

export type DefaultMoodTemplate = {
  id: Mood['id']
  color: string
  image: string
}

export const DEFAULT_FAVORITE_MOODS: DefaultMoodTemplate[] = [
  { color: '#ff0000', image: '/vite.svg' },
  // add here
].map(addId)
export const DEFAULT_GENERAL_MOODS: DefaultMoodTemplate[] = [
  // add here
].map(addId)
export const DEFAULT_ARCHIVED_MOODS: DefaultMoodTemplate[] = [
  // add heres
].map(addId)

export const DEFAULT_MOOD_COLLECTION: MoodCollection = {
  favorites: DEFAULT_FAVORITE_MOODS.map((mood) => mood.id),
  general: DEFAULT_GENERAL_MOODS.map((mood) => mood.id),
  archived: DEFAULT_ARCHIVED_MOODS.map((mood) => mood.id),
}

function addId<T>(x: T): T & { id: Mood['id'] } {
  return { id: generateId(), ...x }
}
