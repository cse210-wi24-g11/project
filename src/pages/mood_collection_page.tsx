import { Button, Text } from '@adobe/react-spectrum'
import React, { useEffect, useState } from 'react'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { useDb } from '@/context/db.tsx'

import MoodIcon from '@/components/MoodIcon.tsx'
type Mood = {
  color: string
  image: string
  id: number
}

//favorite section
export type MoodSectionProps = {
  moods: Mood[]
}

const MoodSection: React.FC<MoodSectionProps> = ({ moods }) => {
  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        <MoodIcon
          key={i}
          color={mood.color}
          image_URL={mood.image}
          id={mood.id}
        />
      ))}
    </div>
  )
}

function MoodCollectionPage() {
  const {getDb} = useDb()
  const collectionTypes: string[] = ['favorite', 'general', 'archived']
  const [favoriteMoods, setFavorites] = useState<Mood[]>([]);
  const [generalMoods, setGeneral] = useState<Mood[]>([]);
  const [archivedMoods, setArchived] = useState<Mood[]>([]);

  useEffect(() => {
    async function run() {
      const db = await getDb()
      for (const type of collectionTypes) {
        const requestType = db
          .transaction('moodCollection', 'readonly')
          .objectStore('moodCollection')
          .get(type)
        requestType.onsuccess = (event) => {
          const targetCollection = event.target as IDBRequest
          const typeIDData = targetCollection.result.moods
          for (const moodID of typeIDData) {
            const requestMood = db
              .transaction('mood', 'readonly')
              .objectStore('mood')
              .get(moodID)
            requestMood.onsuccess = (event) => {
              const targetMood = event.target as IDBRequest
              const mood = targetMood.result.mood
              // TODO: replace these with setState, make sure they're reassigned
              if (type === 'favorite') {
                setFavorites([...favoriteMoods, mood]) // -> setFavoriteMoods(moods => [...moods, mood])
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

    run()
  }, [])

  const handleClick = () => {
    //open custom mood page
    // navigate(`/CustomMoodPage`);
  }
  return (
    <>
      <div>
        <Button variant="primary" onPress={handleClick}>
          <Text>Add New Mood</Text>
        </Button>
        <h1>Favorites</h1>
        <MoodSection moods={favoriteMoods} />
        <h1>General</h1>
        <MoodSection moods={generalMoods} />
        {/* <h1>Archived</h1>
        <MoodSection moods={archivedMoods} /> */}
      </div>
      <MainNavBar />
    </>
  )
}

export default MoodCollectionPage
