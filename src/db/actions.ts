/**
 * @fileoverview
 * functions for reading from and writing to the database
 */

import { type Querier, db, useQuery } from './index.ts'
import { SETTINGS_KEY } from './constants.ts'
import {
  type ExpandedEntry,
  expandEntry,
  serializeDateForEntry,
  ExpandedMood,
  expandMood,
} from './utils.ts'

import type {
  Entry,
  Mood,
  MoodCollection,
  MoodCollectionCategory,
  MoodId,
  Settings,
} from './types.ts'

function createHook<T>(query: Querier<T>) {
  return <I>(initial: I) => useQuery(query, [], initial)
}

export const useSettings = createHook(getSettings)
export const useMoodCollection = createHook(getMoodCollection)
export const useFavoriteMoods = createHook(getFavoriteMoods)

export async function getSettings() {
  const settings = await db.settings.get(SETTINGS_KEY)
  // settings are populated on db initialization,
  // only ever get updated and not removed,
  // and use a stable, constant key.
  // as such we know that `get` should always be successful and return a value.
  return settings!
}

/**
 * updates some subset of settings.
 *
 * see https://dexie.org/docs/Table/Table.update()#return-value for how to interpret the return value.
 */
export async function updateSettings(settings: Partial<Settings>) {
  return db.settings.update(SETTINGS_KEY, settings)
}

export async function updateMoodCollection(
  moodCollection: Partial<MoodCollection>,
) {
  const items = Object.entries(moodCollection) as Array<
    [MoodCollectionCategory, MoodId[]]
  >
  return Promise.all(
    items.map(([category, value]) => db.moodCollection.put(value, category)),
  )
}

export async function getMoodCollection(): Promise<MoodCollection> {
  const [favorites, general, archived] = await Promise.all([
    getMoodIdsInCategory('favorites'),
    getMoodIdsInCategory('general'),
    getMoodIdsInCategory('archived'),
  ])
  return { favorites, general, archived }
}

export async function getExpandedMoodCollection(): Promise<
  Record<MoodCollectionCategory, Mood[]>
> {
  const moodCollection = await getMoodCollection()
  return {
    favorites: await expandMoodIds(moodCollection.favorites),
    general: await expandMoodIds(moodCollection.general),
    archived: await expandMoodIds(moodCollection.archived),
  }
}

export async function getFullyExpandedMoodCollection(): Promise<
  Record<MoodCollectionCategory, ExpandedMood[]>
> {
  const moodCollection = await getMoodCollection()
  return {
    favorites: await fullyExpandMoodIds(moodCollection.favorites),
    general: await fullyExpandMoodIds(moodCollection.general),
    archived: await fullyExpandMoodIds(moodCollection.archived),
  }
}

export async function getMoodIdsInCategory(category: MoodCollectionCategory) {
  const moodIds = await db.moodCollection.get(category)
  return moodIds ?? []
}

export async function expandMoodIds(moodIds: MoodId[]): Promise<Mood[]> {
  const moods = await db.moods.bulkGet(moodIds ?? [])
  const validMoods = moods.filter(Boolean) as Mood[]
  return validMoods
}

export async function fullyExpandMoodIds(
  moodIds: MoodId[],
): Promise<ExpandedMood[]> {
  const moods = await expandMoodIds(moodIds)
  const expandedMoods = await Promise.all(moods.map(expandMood))
  return expandedMoods
}

export async function getFavoriteMoods() {
  const moodIds = await getMoodIdsInCategory('favorites')
  const moods = expandMoodIds(moodIds)
  return moods
}

/**
 * moves the mood with id `moodId` from category `from` to category `to` in the mood collection,
 * at index `i` of the `to` category.
 *
 * if `i` is not defined, the mood is added to the end of the `to` category.
 *
 * returns `null` and does not do anything if the mood id was not found in category `from`.
 * otherwise returns the result of removing from `from` and adding to `to`
 */
export async function moveInCollection<
  From extends MoodCollectionCategory,
  To extends Exclude<MoodCollectionCategory, From>,
>(moodId: MoodId, from: From, to: To, toI?: number) {
  const [fromCollection, toCollection] = await Promise.all([
    getMoodIdsInCategory(from),
    getMoodIdsInCategory(to),
  ])

  const j = fromCollection.findIndex((id) => id === moodId)
  if (j === -1) {
    return null
  }

  const [id] = fromCollection.splice(j, 1)
  toCollection.splice(toI ?? toCollection.length, 0, id)

  const result = await Promise.all([
    db.moodCollection.put(fromCollection, from),
    db.moodCollection.put(toCollection, to),
  ])

  return result
}

/**
 * adds mood id `moodId` to category `to` in the mood collection at index `i` (or to the end, if defined).
 *
 * if `moodId` is in another category, removes it from that category (i.e. "moves it" from that category to `to`)
 */
export async function moveOrAddToInCollection(
  moodId: MoodId,
  to: MoodCollectionCategory,
  i?: number,
) {
  let from: [MoodCollectionCategory, number] | null = null
  const moodCollection = await getMoodCollection()
  if (i === undefined) {
    i = moodCollection[to].length
  }

  for (const category in moodCollection) {
    const j = moodCollection[category as MoodCollectionCategory].indexOf(moodId)
    if (j !== -1) {
      from = [category as MoodCollectionCategory, j]
      break
    }
  }

  // if we're moving within a category, just shift position instead
  if (from !== null && from[0] === to) {
    const [category, j] = from
    if (j === i) {
      return
    }

    moodCollection[category].splice(j, 1)
    // if we found it at an earlier index, splicing it means the target index should also shift down by 1
    if (j < i) {
      i -= 1
    }

    moodCollection[to].splice(i, 0, moodId)

    return Promise.all([
      db.moodCollection.put(moodCollection[category], category),
      db.moodCollection.put(moodCollection[to], to),
    ])
  }

  if (from !== null) {
    const [category, j] = from

    moodCollection[category].splice(j, 1)
    moodCollection[to].splice(i ?? moodCollection[to].length, 0, moodId)

    return Promise.all([
      db.moodCollection.put(moodCollection[category], category),
      db.moodCollection.put(moodCollection[to], to),
    ])
  }

  // mood id is not in the collection yet
  moodCollection[to].splice(i ?? moodCollection[to].length, 0, moodId)
  return db.moodCollection.put(moodCollection[to], to)
}

/**
 * gets the list of all entries whose date (year/month/day) matches that of the date passed in.
 *
 * the returned list is sorted in reverse chronological order, based on the entries' timestamps.
 */
export async function getEntriesForDate(date: Date) {
  const entries = await db.entries
    .where('date')
    .equals(serializeDateForEntry(date))
    //.where('timestamp').between(...getTodayRange(today.getTime()))  // alternate
    .toArray()

  const sortedEntries = entries.sort(compareEntryReverseChronological)
  return sortedEntries
}

/**
 * gets the list of all entries whose date (year/month/day) matches that of the date passed in.
 *
 * the resultant entries are in "full form", i.e. contain the full mood object they refer to rather than just the id.
 *
 * the returned list is sorted in reverse chronological order, based on the entries' timestamps.
 */
export async function getResolvedEntriesForDate(date: Date) {
  const entries = await db.entries
    .where('date')
    .equals(serializeDateForEntry(date))
    //.where('timestamp').between(...getTodayRange(today.getTime()))  // alternate
    .toArray()

  const moods = await db.moods.bulkGet(entries.map((e) => e.moodId))
  const validMoods = moods.filter(Boolean) as Mood[]
  const moodIdToMood = new Map(validMoods.map((mood) => [mood.id, mood]))
  const sortedEntries = entries.sort(compareEntryReverseChronological)
  const expandedEntries = await Promise.all(
    sortedEntries.map((entry) => expandEntry(entry, moodIdToMood)),
  )
  const validExpandedEntries = expandedEntries.filter(
    (x) => x !== null,
  ) as ExpandedEntry[]
  return validExpandedEntries
}

function compareEntryReverseChronological(a: Entry, b: Entry) {
  return b.timestamp - a.timestamp
}
