import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text } from '@adobe/react-spectrum'

import { CUSTOM_MOOD_ROUTE, Route, EDIT_MOOD_ROUTE } from '@/routes.ts'
import { useQuery } from '@/db/index.ts'
import { getFullyExpandedMoodCollection } from '@/db/actions.ts'
import { ExpandedMood, blobToUrl } from '@/db/utils.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'
import background from '@/assets/background.png'

import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'

import type { MoodCollection, MoodCollectionCategory } from '@/db/types.ts'

type State = {
  returnTo?: Route
}

export function MoodCollection() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()

  const [moodCollection] = useQuery(getFullyExpandedMoodCollection, [], {
    general: [],
    favorites: [],
    archived: [],
  } as Record<MoodCollectionCategory, ExpandedMood[]>)

  const addCustomMood = () => {
    navigate(CUSTOM_MOOD_ROUTE)
  }

  const onClickMood = useMemo(() => {
    if (!state?.returnTo) {
      function onClick(mood: ExpandedMood) {
        navigate(`${EDIT_MOOD_ROUTE}/${mood.id}`)
      }
      return onClick
    }

    function onClick(mood: ExpandedMood) {
      console.log(state!.returnTo, mood)
      navigate(state!.returnTo as Route, { state: { selectedMood: mood } })
    }
    return onClick
  }, [state, navigate])

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: '100vw 100vh',
      }}
      className="flex h-screen flex-col"
    >
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
    </div>
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
