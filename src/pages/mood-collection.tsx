import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text } from '@adobe/react-spectrum'

import { CUSTOM_MOOD_ROUTE, Route } from '@/routes.ts'
import { useQuery } from '@/db/index.ts'
import { getFullyExpandedMoodCollection } from '@/db/actions.ts'
import { ExpandedMood, blobToUrl } from '@/db/utils.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'

import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
<<<<<<< HEAD
import { useDb } from '@/context/db.tsx'
type Mood = {
  id: string
  color: string
  image: Blob
}
=======
>>>>>>> main

import type { MoodCollection, MoodCollectionCategory } from '@/db/types.ts'

type State = {
  returnTo?: Route
}

export function MoodCollection() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()
<<<<<<< HEAD
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string })?.returnTo

  useEffect(() => {
    async function run() {
      const collectionTypes: string[] = ['favorites', 'general', 'archived']
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
          const moodIDs = targetCollection.result as string[]
          for (const moodID of moodIDs) {
            const requestMood = db
              .transaction('mood', 'readonly')
              .objectStore('mood')
              .get(moodID)
            requestMood.onsuccess = (event) => {
              const targetMood = event.target as IDBRequest
              const moodData = targetMood.result as Mood
              if (type === 'favorites' && targetMood) {
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

  const handleSelectMood = (selectedMood: DbRecord<'mood'>) => {
    if (returnTo) {
      navigate(returnTo, { state: { selectedMood: selectedMood } })
    } else {
      console.log('No returnTo path specified.')
    }
  }
=======

  const [moodCollection] = useQuery(getFullyExpandedMoodCollection, [], {
    general: [],
    favorites: [],
    archived: [],
  } as Record<MoodCollectionCategory, ExpandedMood[]>)
>>>>>>> main

  const addCustomMood = () => {
    navigate(CUSTOM_MOOD_ROUTE)
  }

  const onClickMood = useMemo(() => {
    if (!state?.returnTo) {
      return undefined
    }

    function onClick(mood: ExpandedMood) {
      console.log(state!.returnTo, mood)
      navigate(state!.returnTo as Route, { state: { selectedMood: mood } })
    }
    return onClick
  }, [state, navigate])

  return (
    <>
      <div className="mt-8 flex flex-col items-center space-y-4">
        <Button variant="primary" onPress={addCustomMood}>
          <Text>Add New Mood</Text>
        </Button>
        <h1>Favorites</h1>
        <MoodSection
          moods={moodCollection.favorites}
          onClickMood={onClickMood}
        />
        <h1>General</h1>
        <MoodSection moods={moodCollection.general} onClickMood={onClickMood} />
        <h1>Archived</h1>
        <MoodSection
          moods={moodCollection.archived}
          onClickMood={onClickMood}
        />
      </div>
      <MainNavBar />
    </>
  )
}

//favorite section
type MoodSectionProps = {
  moods: ExpandedMood[]
  onClickMood?: (mood: ExpandedMood) => unknown
}

function MoodSection({ moods, onClickMood }: MoodSectionProps) {
  const getOnClick = useMemo(() => {
    if (!onClickMood) {
      return undefined
    }
    return (mood: ExpandedMood) => () => onClickMood(mood)
  }, [onClickMood])

  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        <MoodSwatch
          key={i}
          color={mood.color}
          imgSrc={blobToUrl(mood.imageBlob)}
          onClick={getOnClick?.(mood)}
          size="single-line-height"
        />
      ))}
    </div>
  )
}

function validateState(state: Record<string, unknown>): state is State {
  const { returnTo } = state
  if (!returnTo) {
    return false
  }
  if (typeof returnTo !== 'string') {
    return false
  }
  return true
}
