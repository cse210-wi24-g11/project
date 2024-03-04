import { useEffect } from 'react'

import { useDb } from '@/context/db.tsx'

export function DbTest() {
  const { getDb } = useDb()

  useEffect(() => {
    async function run() {
      const db = await getDb()
      db.transaction('mood', 'readwrite')
        .objectStore('mood')
        .put({ id: '1', color: 'blue', image: new Blob() })
    }

    void run()
  }, [getDb])

  return (
    <div>
      <div className="text-black">DB Test Page</div>
    </div>
  )
}
