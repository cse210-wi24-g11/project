import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text } from '@adobe/react-spectrum'

import { CUSTOM_MOOD_ROUTE, Route } from '@/routes.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { DndMoodCollection } from '@/components/mood-collection/dnd/dnd-mood-collection.tsx'
import { SelectionMoodCollection } from '@/components/mood-collection/selection/selection-mood-collection.tsx'

import type { MoodCollection } from '@/db/types.ts'

type State = {
  returnTo?: Route
}

export function MoodCollection() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()

  const addCustomMood = () => {
    navigate(CUSTOM_MOOD_ROUTE)
  }

  const isReadonly = useMemo(() => !!state?.returnTo, [state])

  return (
    <>
      <main className="mt-8 flex flex-col items-center w-full h-full gap-4 px-4">
        <Button variant="primary" onPress={addCustomMood}>
          <Text>Add New Mood</Text>
        </Button>
        {isReadonly ? (
          <SelectionMoodCollection returnTo={state!.returnTo!} />
        ) : (
          <DndMoodCollection />
        )}
      </main>
      <MainNavBar />
    </>
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
