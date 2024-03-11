/**
 * @fileoverview
 * functions for reading from and writing to the database
 */

import { type Querier, db, useQuery } from './index.ts'
import { MOOD_COLLECTION_KEY, SETTINGS_KEY } from './constants.ts'
import {
  type ExpandedEntry,
  expandEntry,
  serializeDateForEntry,
} from './utils.ts'

import type {
  Entry,
  Mood,
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

export async function getMoodCollection() {
  const moodCollection = await db.moodCollection.get(MOOD_COLLECTION_KEY)
  // mood collection is populated on db initialization,
  // only ever gets updated and not removed,
  // and uses a stable, constant key.
  // as such we know that `get` should always be successful and return a value.
  return moodCollection!
}

export async function getFavoriteMoods() {
  const moodCollection = await getMoodCollection()
  const { favorites: favoriteMoodsIds } = moodCollection
  const favoriteMoods = await db.moods.bulkGet(favoriteMoodsIds)
  const validFavoriteMoods = favoriteMoods.filter(Boolean) as Mood[]
  return validFavoriteMoods
}

/**
 * moves the mood with id `moodId` from category `from` to category `to` in the mood collection,
 * at index `i` of the `to` category.
 *
 * if `i` is not defined, the mood is added to the end of the `to` category.
 *
 * returns `null` and does not do anything if the mood id was not found in category `from`.
 * otherwise returns the result of updating the mood collection (see https://dexie.org/docs/Table/Table.update()#return-value)
 */
export async function moveInCollection<
  From extends MoodCollectionCategory,
  To extends Exclude<MoodCollectionCategory, From>,
>(moodId: MoodId, from: From, to: To, i?: number) {
  const moodCollection = await getMoodCollection()

  const j = moodCollection[from].findIndex((id) => id === moodId)
  if (j === -1) {
    return null
  }

  const [id] = moodCollection[from].splice(j, 1)
  moodCollection[to].splice(i ?? moodCollection[to].length, 0, id)

  const result = await db.moodCollection.update(MOOD_COLLECTION_KEY, {
    [from]: moodCollection[from],
    [to]: moodCollection[to],
  })

  return result
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
  const resolvedEntries = entries
    .sort(compareEntryReverseChronological)
    .map((entry) => expandEntry(entry, moodIdToMood))
    .filter((x) => x !== null) as ExpandedEntry[]
  return resolvedEntries
}

function compareEntryReverseChronological(a: Entry, b: Entry) {
  return b.timestamp - a.timestamp
}
