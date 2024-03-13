import { useMemo } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'

import { blobToUrl, type ExpandedMood } from '@/db/utils.ts'

import { MoodCollectionMoodSwatch } from '../mood-swatch.tsx'

import { useMountStatus } from './use-mount-status.ts'
import { Item } from './item.tsx'

interface DraggableItemProps {
  id: UniqueIdentifier
  mood: ExpandedMood
}

export function DraggableSwatchItem({ id, mood }: DraggableItemProps) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({ id })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  const imageUrl = useMemo(() => blobToUrl(mood.imageBlob), [mood])

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
    >
      <MoodCollectionMoodSwatch color={mood.color} imgSrc={imageUrl} />
    </Item>
  )
}
