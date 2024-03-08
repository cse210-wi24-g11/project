import { useEffect } from 'react'

import { useDb } from '@/context/db.tsx'

export function DbTest() {
  const { getDb } = useDb()

  useEffect(() => {
    async function run() {
      const db = await getDb()
      /* add a data instance to entry */
      /* const entryStore = db
        .transaction('entry', 'readwrite')
        .objectStore('entry')
      entryStore.add({ id: 1, moodId: 1, description: "this is a test entry", date: new Date() }) */

      const transaction = db.transaction(
        ['dateCollection', 'entry'],
        'readwrite',
      )

      const entryStore = transaction.objectStore('entry')
      const entryRequest = entryStore.get(1)

      entryRequest.onsuccess = function () {
        const dateStore = transaction.objectStore('dateCollection')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dateStore.put({ entry: entryRequest.result }, '2024.3.5')
      }
    }
    void run()
  }, [getDb])

  return (
    <div>
      <div className="text-black">DB Test Page</div>
    </div>
  )
}
