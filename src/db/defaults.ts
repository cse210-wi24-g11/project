import type { Mood, MoodCollection, Settings } from './types.ts'

export const DEFAULT_SETTINGS: Settings = {
  defaultView: 'month',
  remindMe: 'none',
  reminderTimes: 'none',
}

export const DEFAULT_FAVORITE_MOODS: Array<
  Omit<Mood, 'image'> & { image: string }
> = [
  {
    id: globalThis.crypto.randomUUID(),
    color: '#ff0000',
    image: '/vite.svg',
  },
]

export const DEFAULT_MOOD_COLLECTION: MoodCollection = {
  favorites: DEFAULT_FAVORITE_MOODS.map((mood) => mood.id),
  general: [],
  archived: [],
}
