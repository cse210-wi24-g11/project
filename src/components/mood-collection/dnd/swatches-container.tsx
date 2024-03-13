import { useMemo } from 'react'

import { ExpandedMood } from '@/db/utils.ts'

import { DraggableSwatchItem } from './draggable-swatch-item.tsx'
import { DroppableContainer } from './droppable-container.tsx'

import type { MoodCollectionCategory, MoodId } from '@/db/types'

type SwatchesContainerProps = {
  id: MoodCollectionCategory
  items: MoodId[]
  moodIdToExpandedMoodMap: Map<MoodId, ExpandedMood>
}

export function SwatchesContainer({
  id,
  items,
  moodIdToExpandedMoodMap,
}: SwatchesContainerProps) {
  const expandedMoods = useMemo(
    () =>
      items
        .map((id) => moodIdToExpandedMoodMap.get(id))
        .filter(Boolean) as ExpandedMood[],
    [items, moodIdToExpandedMoodMap],
  )

  return (
    <DroppableContainer id={id} items={items}>
      {expandedMoods.map((mood) => (
        <DraggableSwatchItem key={mood.id} mood={mood} id={mood.id} />
      ))}
    </DroppableContainer>
  )
}
