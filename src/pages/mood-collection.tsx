import { Button, Text } from '@adobe/react-spectrum'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CUSTOM_MOOD_ROUTE } from '@/routes.ts'

import { MoodIcon } from '@/components/mood-icon.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { useDb } from '@/context/db.tsx'
type Mood = {
  color: string
  image: string
  id: number
}

//favorite section
export type MoodSectionProps = {
  moods: Mood[]
}

const MoodSection: React.FC<MoodSectionProps> = function ({ moods }) {
  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        <MoodIcon
          key={i}
          color={mood.color}
          imageURL={mood.image}
          id={mood.id}
        />
      ))}
    </div>
  )
}

export function MoodCollectionPage() {
  const { getDb } = useDb()
  const [favoriteMoods, setFavorites] = useState<Mood[]>([])
  const [generalMoods, setGeneral] = useState<Mood[]>([])
  const [archivedMoods, setArchived] = useState<Mood[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    async function run() {
      const collectionTypes: string[] = ['favorite', 'general', 'archived']
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
              const moodObj = targetMood.result as { mood: Mood }
              const mood = moodObj.mood
              if (type === 'favorite') {
                setFavorites([...favoriteMoods, mood])
              } else if (type === 'general') {
                setGeneral([...generalMoods, mood])
              } else {
                setArchived([...archivedMoods, mood])
              }
            }
          }
        }
      }
    }

    void run()
  }, [archivedMoods, favoriteMoods, generalMoods, getDb])

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
      </div>
      <MainNavBar />
    </>
  )
}