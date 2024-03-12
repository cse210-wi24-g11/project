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
  { color: '#f2cc59', image: '/src/assets/default-moods/happy.png' },
  { color: '#fc805e', image: '/src/assets/default-moods/overwhelmed.png' },
  { color: '#df5c50', image: '/src/assets/default-moods/angry.png' },
  { color: '#b499e4', image: '/src/assets/default-moods/meh.png' },
  { color: '#85aedd', image: '/src/assets/default-moods/sad.png' },

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
