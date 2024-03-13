// https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { useQuery } from '@/db/index.ts'
import { fullyExpandMoodIds, getMoodCollection } from '@/db/actions.ts'
import { ExpandedMood, blobToUrl } from '@/db/utils.ts'
import { useAsyncMemo } from '@/hooks/use-async-memo.ts'

import {
  CATEGORIES,
  CATEGORIES_WITH_LABELS,
  sectionStyles,
  sectionsContainerStyles,
} from '../constants.ts'
import { MoodCollectionMoodSwatch } from '../mood-swatch.tsx'

import { dropAnimation, measuringConfiguration } from './configs.ts'
import { useCollisionDetectionStrategy } from './use-collision-detection-strategy.ts'
import { useDragHandlers } from './use-drag-handlers.ts'
import { useSensors } from './use-sensors.ts'
import { useRecentlyMovedToNewContainerRef } from './use-recently-moved-to-container-ref.ts'
import { Item } from './item.tsx'
import { SwatchesContainer } from './swatches-container.tsx'

import type { MoodCollection, MoodId } from '@/db/types.ts'

type MultipleContainersProps = {
  adjustScale?: boolean
}

export function DndMoodCollection({
  adjustScale = false,
}: MultipleContainersProps) {
  const sensors = useSensors()

  const [moodCollection] = useQuery(getMoodCollection, [], {
    general: [],
    favorites: [],
    archived: [],
  } as MoodCollection)

  // whereas moodCollection is always syncd with the database, items is the current view of the ui -
  // for example, when dragging a mood to another location/position,
  // we should show the updated location,
  // even before the database updates it.
  // once the database _does_ update it, or when the database does change,
  // we should synchronize back with it though.
  const [items, setItems] = useState<MoodCollection>(moodCollection)
  useEffect(() => {
    setItems(moodCollection)
  }, [moodCollection])
  const [cloned, setCloned] = useState<MoodCollection | null>(null)
  const moodIdToExpandedMoodMap = useAsyncMemo(
    async () => {
      return new Map<MoodId, ExpandedMood>(
        [
          ...(await fullyExpandMoodIds(moodCollection.favorites)),
          ...(await fullyExpandMoodIds(moodCollection.general)),
          ...(await fullyExpandMoodIds(moodCollection.archived)),
        ].map((mood) => [mood.id, mood] as const),
      )
    },
    [moodCollection],
    new Map<MoodId, ExpandedMood>(),
  )

  const [activeId, setActiveId] = useState<MoodId | null>(null)
  const recentlyMovedToNewContainerRef =
    useRecentlyMovedToNewContainerRef(items)
  const collisionDetectionStrategy = useCollisionDetectionStrategy(
    activeId,
    items,
    recentlyMovedToNewContainerRef,
  )

  const expandedMoodForActiveId = useMemo(() => {
    if (activeId === null) {
      return null
    }
    return moodIdToExpandedMoodMap.has(activeId)
      ? moodIdToExpandedMoodMap.get(activeId)!
      : null
  }, [activeId, moodIdToExpandedMoodMap])
  const imageUrlForMoodForActiveId = useMemo(() => {
    if (expandedMoodForActiveId === null) {
      return null
    }
    return blobToUrl(expandedMoodForActiveId.imageBlob)
  }, [expandedMoodForActiveId])

  const onDragProps = useDragHandlers({
    items,
    setItems,
    cloned,
    setCloned,
    setActiveId,
    recentlyMovedToNewContainerRef,
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={measuringConfiguration}
      {...onDragProps}
    >
      <div className={sectionsContainerStyles}>
        <SortableContext
          items={CATEGORIES}
          strategy={verticalListSortingStrategy}
        >
          {CATEGORIES_WITH_LABELS.map(({ category, label }) => (
            <section key={category} className={sectionStyles}>
              <h1>{label}</h1>
              <SwatchesContainer
                id={category}
                items={items[category]}
                moodIdToExpandedMoodMap={moodIdToExpandedMoodMap}
              />
            </section>
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {expandedMoodForActiveId && imageUrlForMoodForActiveId ? (
            <Item dragOverlay>
              <MoodCollectionMoodSwatch
                color={expandedMoodForActiveId.color}
                imgSrc={imageUrlForMoodForActiveId}
              />
            </Item>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
