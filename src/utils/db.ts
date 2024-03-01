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
      /* create object stores (can be deemed as tables) for the different data instances */
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

/* insert data instances to the corresponding object store */
export function putData(db: IDBDatabase, data: object, STORE_NAME: string) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(data)

    request.onsuccess = function () {
      resolve(request.result)
    }

    request.onerror = function () {
      reject('Error writing data')
    }
  })
}

/* insert data instances to the corresponding object store */
export function putMood(
  db: IDBDatabase,
  data: { id: string; mood: string; imagePath: string },
) {
  return putData(db, data, 'mood')
}

/* string[] should be list of mood ids */
export function putMoodCollection(
  db: IDBDatabase,
  data: { favorites: string[]; general: string[]; archived: string[] },
) {
  return putData(db, data, 'moodCollection')
}

export function putEntry(
  db: IDBDatabase,
  data: { id: string; moodId: string; description: string; timestamp: Date },
) {
  return putData(db, data, 'entry')
}

export function putSettings(
  db: IDBDatabase,
  data: { notificationTime: string; defaultViewId: string },
) {
  return putData(db, data, 'settings')
}

/* get all data instances from the corresponding object store */
export function getDataAll(db: IDBDatabase, STORE_NAME: string) {
  /* the return type is unknown
   ** need to actually fetch some data to see */
  return new Promise<unknown>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    /*
     ** if the keyPath is null or the id is null, fetch all data from the object store
     ** this is the case for the moodCollection and settings object stores
     */
    const request = store.getAll()
    request.onsuccess = function () {
      resolve(request.result)
    }
    request.onerror = function () {
      reject('Error retrieving data')
    }
  })
}

export function getMoodAll(db: IDBDatabase) {
  return getDataAll(db, 'mood')
}

export function getMoodCollectionAll(db: IDBDatabase) {
  return getDataAll(db, 'moodCollection')
}

export function getEntryAll(db: IDBDatabase) {
  return getDataAll(db, 'entry')
}

export function getSettingsAll(db: IDBDatabase) {
  return getDataAll(db, 'settings')
}
