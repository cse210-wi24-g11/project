// db.ts
import {
  getDateAbbr,
  getEntryDateKey,
  SummaryMoodRecord,
  TempEntry,
} from '@/components/SummaryHelper.ts'

const DB_NAME = 'user_db'

/*
 ** open the indexedDB database
 ** returns a promise that resolves to the database object
 ** or rejects with an error message
 */
export const openDb = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = function () {
      const db = request.result
      /* create object stores (can be deemed as tables) for different data instances */
      const moodStore = db.createObjectStore('mood', { keyPath: 'id' })
      const moodCollectionStore = db.createObjectStore('moodCollection', {
        keyPath: null,
      })
      db.createObjectStore('entry', { keyPath: 'id' })
      db.createObjectStore('settings', { keyPath: null })
      const dateCollection = db.createObjectStore('dateCollection', {
        keyPath: null,
      })

      /* add default data to the mood store */
      const colors = ['blue', 'green', 'yellow', 'orange', 'red']
      for (let i = 1; i <= 5; i++) {
        moodStore.add({ id: `${i}`, color: colors[i - 1], image: new Blob() })
      }

      /* initialize mood collection with empty arrays */
      moodCollectionStore.add(
        { favorites: [], general: [], archived: [] },
        'allMoods',
      )

      /* add entry in date collection for tests in day summary page */
      const today = new Date()
      const todayStr = getDateAbbr(today)
      const tmp1: TempEntry[] = [
        {
          id: '1',
          moodId: '1',
          description: `this is a test entry for ${todayStr}. test test test test test test test test test test test `,
          timestamp: today,
        },
        {
          id: '2',
          moodId: '2',
          description: `this is a test entry for ${todayStr}.test test test test test test test test test test test test test test test test test test test test `,
          timestamp: today,
        },
      ] // TODO: change data type
      // console.log('db create date collection:', tmp1);
      dateCollection.add(tmp1, getEntryDateKey(today))

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      console.log('yesterday:', yesterday)
      const tmp2: TempEntry[] = Array.from({ length: 10 }, (_, index) => ({
        id: (index + 100 * yesterday.getDate()).toString(),
        moodId: '3',
        description: 'Test for ' + getEntryDateKey(yesterday),
        timestamp: yesterday,
      }))
      dateCollection.add(tmp2, getEntryDateKey(yesterday))
    }

    request.onsuccess = function () {
      resolve(request.result)
    }

    request.onerror = function () {
      reject('Error opening db')
    }
  })
}
