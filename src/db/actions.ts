/**
 * @fileoverview
 * functions for reading from and writing to the database
 */

import { db, useQuery } from './index.ts'
import { MOOD_COLLECTION_KEY, SETTINGS_KEY } from './constants.ts'

import type { Mood, MoodCollectionCategory, MoodId, Settings } from './types.ts'

export function useSettings<T>(initial?: T) {
  return useQuery(
    async (db) => {
      const settings = await db.settings.get(SETTINGS_KEY)
      // settings are populated on db initialization,
      // only ever get updated and not removed,
      // and use a stable, constant key.
      // as such we know that `get` should always be successful and return a value.
      return settings!
    },
    [],
    initial,
  )
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
  return (await db.moodCollection.get(MOOD_COLLECTION_KEY))!
}

export function useMoodCollection<T>(initial?: T) {
  return useQuery(getMoodCollection, [], initial)
}

export function useFavoriteMoods<T>(initial?: T) {
  return useQuery(async (db) => {
    const moodCollection = await getMoodCollection()
    const { favorites: favoriteMoodsIds } = moodCollection
    const favoriteMoods = await db.moods.bulkGet(favoriteMoodsIds)
    const validFavoriteMoods = favoriteMoods.filter(Boolean) as Mood[]
    return validFavoriteMoods
  }, [], initial)
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
  To extends Exclude<MoodCollectionCategory, From>
>(moodId: MoodId, from: From, to: To, i?: number) {
  const moodCollection = await getMoodCollection()

  const j = moodCollection[from].findIndex(id => id === moodId)
  if (j === -1) { return null }
  
  const [id] = moodCollection[from].splice(j, 1)
  moodCollection[to].splice(i ?? moodCollection[to].length, 0, id)
  
  const result = await db.moodCollection.update(MOOD_COLLECTION_KEY, {
    [from]: moodCollection[from],
    [to]: moodCollection[to],
  })

  return result
}