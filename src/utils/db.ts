// db.ts
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
      db.createObjectStore('mood', { keyPath: 'id' })
      db.createObjectStore('moodCollection', { keyPath: null })
      db.createObjectStore('entry', { keyPath: 'id' })
      db.createObjectStore('settings', { keyPath: null })
    }

    request.onsuccess = function () {
      resolve(request.result)
    }

    request.onerror = function () {
      reject('Error opening db')
    }
  })
}
