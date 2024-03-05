import { useEffect } from 'react'

import { useDb } from '@/context/db.tsx'

export function DbTest() {
  const { getDb } = useDb()

  useEffect(() => {
    async function run() {
      const db = await getDb()
      db.transaction('moodCollection', 'readwrite')
        .objectStore('moodCollection')
        .add({ favorites: ['1'], general: [], archived: [] }, 'test')
    }
    void run()
  }, [getDb])

  return (
    <div>
      <div className="text-black">DB Test Page</div>
    </div>
  )
}
