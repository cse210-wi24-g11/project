// db.ts
const DB_NAME = 'user_db'

const MOOD_COLLECTION_KEY = 'allMoods'

/*
 ** open the indexedDB database
 ** returns a promise that resolves to the database object
 ** or rejects with an error message
 */
export function openDb() {
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
      db.createObjectStore('dateCollection', { keyPath: null })

      /* add default data to the mood store */
      const colors = ['blue', 'green', 'yellow', 'orange', 'red']
      for (let i = 1; i <= 5; i++) {
        moodStore.add({ id: `${i}`, color: colors[i - 1], image: new Blob() })
      }

      /* initialize mood collection with empty arrays */
      moodCollectionStore.add(
        { favorites: [], general: [], archived: [] },
        MOOD_COLLECTION_KEY,
      )
    }

    request.onsuccess = function () {
      resolve(request.result)
    }

    request.onerror = function () {
      reject('Error opening db')
    }
  })
}
