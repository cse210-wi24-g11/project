import { ReactNode } from 'react'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Container } from '../container.tsx'

import { animateLayoutChanges } from './configs.ts'

import type { MoodCollectionCategory, MoodId } from '@/db/types.ts'

type DroppableContainerProps = {
  id: MoodCollectionCategory
  items: MoodId[]
  children: ReactNode
}

export function DroppableContainer({
  id,
  items,
  children,
}: DroppableContainerProps) {
  const { active, isDragging, over, setNodeRef, transition, transform } =
    useSortable({
      id,
      data: {
        type: 'container',
        children: items,
      },
      animateLayoutChanges,
    })

  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
      items.includes(over.id as MoodId)
    : false

  const disabled = false

  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {children}
      </SortableContext>
    </Container>
  )
}
