import type { Entry, Mood } from '@/db/types.ts'

export type ResolvedEntry = Omit<Entry, 'moodId' | 'timestamp'> & {
  mood: Mood
  timestamp: Date
}

/**
 * resolves mood ids to the actual mood objects for a given entry and a mapping of mood ids to moods,
 * and resolves date numbers to Date objects
 */
export function resolveEntry(
  entry: Entry,
  moodIdToMood: Map<Mood['id'], Mood>,
): ResolvedEntry | null {
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
