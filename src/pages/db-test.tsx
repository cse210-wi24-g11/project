import { useEffect } from 'react'

/* import { putMood } from '@/utils/db.ts' */

import { useDb } from '@/context/db.tsx'

export function DbTest() {
  const db = useDb()

  useEffect(() => {
    if (db) {
      console.log('success: db connection is established')
      db.transaction('mood', 'readwrite')
        .objectStore('mood')
        .put({ id: '1', mood: 'happy', image: new Blob() })
    } else {
      console.log('error: db is still null')
    }
  }, [db])

  return (
    <div>
      <div className="text-black">DB Test Page</div>
    </div>
  )
}
