import { Button, Text } from '@adobe/react-spectrum'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CUSTOM_MOOD_ROUTE } from '@/routes.ts'

import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { useDb } from '@/context/db.tsx'
type Mood = {
  color: string
  image: Blob
  id: string
}

//favorite section
export type MoodSectionProps = {
  moods: Mood[]
}

const MoodSection: React.FC<MoodSectionProps> = function ({ moods }) {
  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        mood && <MoodSwatch
          key={i}
          color={mood.color}
          imgSrc={URL.createObjectURL(mood.image)}
          size="single-line-height"
        />
      ))}
    </div>
  )
}

export function MoodCollection() {
  const { getDb } = useDb()
  const [favoriteMoods, setFavorites] = useState<Mood[]>([])
  const [generalMoods, setGeneral] = useState<Mood[]>([])
  const [archivedMoods, setArchived] = useState<Mood[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    async function run() {
      const collectionTypes: string[] = ['favorite', 'general', 'archived']
      const tempFavorites: Mood[] = []
      const tempGeneral: Mood[] = []
      const tempArchived: Mood[] = []
      const db = await getDb()
      for (const type of collectionTypes) {
        const requestType = db
          .transaction('moodCollection', 'readonly')
          .objectStore('moodCollection')
          .get(type)
        requestType.onsuccess = (event) => {
          const targetCollection = event.target as IDBRequest
          const typeIDData = targetCollection.result as { moods: string[] }
          const moodIDs = typeIDData.moods
          for (const moodID of moodIDs) {
            const requestMood = db
              .transaction('mood', 'readonly')
              .objectStore('mood')
              .get(moodID)
            requestMood.onsuccess = (event) => {
              const targetMood = event.target as IDBRequest
              const moodData = targetMood.result as Mood
              if (type === 'favorite' && targetMood) {
                tempFavorites.push(moodData)
                setFavorites(tempFavorites)
              } else if (type === 'general' && targetMood) {
                tempGeneral.push(moodData)
                setGeneral(tempGeneral)
              } else if (type == 'archived' && targetMood) {
                tempArchived.push(moodData)
                setArchived(tempArchived)
              }
            }
          }
        }
      }
    }

    void run()
    return () => {}
  }, [getDb])

  const addCustomMood = () => {
    navigate(CUSTOM_MOOD_ROUTE)
  }
  return (
    <>
      <div>
        <Button variant="primary" onPress={addCustomMood}>
          <Text>Add New Mood</Text>
        </Button>
        <h1>Favorites</h1>
        <MoodSection moods={favoriteMoods} />
        <h1>General</h1>
        <MoodSection moods={generalMoods} />
        <h1>Archived</h1>
        <MoodSection moods={archivedMoods} />
      </div>
      <MainNavBar />
    </>
  )
}
