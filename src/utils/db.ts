// db.ts
const DB_NAME = 'user_db'

export type DbStore = 'mood' | 'moodCollection' | 'entry' | 'settings'

type MoodId = string

export type DbRecord<T extends DbStore> = {
  mood: {
    id: MoodId
    color: string
    imagePath: string
  }
  moodCollection: {
    favorites: MoodId[]
    general: MoodId[]
    archived: MoodId[]
  }
  entry: {
    id: string
    moodId: MoodId
    description: string
    timestamp: Date
  }
  settings: {
    notificationTime: string
    defaultViewId: 'day' | 'week' | 'month'
  }
}[T]

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

function put<T, U extends IDBValidKey | undefined>(
  store: IDBObjectStore,
  value: T,
  key?: U,
): Promise<U> {
  return toPromise(store.put(value, key))
}

function toPromise<T>(req: IDBRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result as T)
    }
    req.onerror = () => {
      reject()
    }
  })
}

/**
 * add a mood entry to the database
 */
export async function putEntry(
  db: IDBDatabase,
  entry: DbRecord<'entry'>,
): Promise<void> {
  const transaction = db.transaction('entry', 'readwrite')
  const store = transaction.objectStore('entry')
  // TODO: what key to use for this, if any?
  await put(store, entry)
}

export async function getFavoriteMoods(
  db: IDBDatabase,
): Promise<DbRecord<'mood'>[]> {
  const transaction = db.transaction(['mood', 'moodCollection'], 'readonly')
  const moodStore = transaction.objectStore('mood')
  const moodCollectionStore = transaction.objectStore('moodCollection')
  const moodCollection = await toPromise<DbRecord<'moodCollection'>>(
    moodCollectionStore.get(MOOD_COLLECTION_KEY),
  )
  const favoriteMoodIds = moodCollection.favorites

  const favoriteMoods = await toPromise<DbRecord<'mood'>[]>(
    moodStore.get(favoriteMoodIds),
  )
  return favoriteMoods
}
