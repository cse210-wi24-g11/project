import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { updateMoodCollection } from '@/db/actions.ts'
import { moveInVirtualCollection } from '@/db/utils.ts'

import type {
  MoodCollection,
  MoodCollectionCategory,
  MoodId,
} from '@/db/types.ts'

interface UseDragHandlersArgs {
  items: MoodCollection
  setItems: Dispatch<SetStateAction<this['items']>>
  cloned: MoodCollection | null
  setCloned: Dispatch<SetStateAction<this['cloned']>>
  setActiveId: Dispatch<SetStateAction<MoodId | null>>
  recentlyMovedToNewContainerRef: MutableRefObject<boolean>
}

export function useDragHandlers({
  items,
  setItems,
  cloned,
  setCloned,
  setActiveId,
  recentlyMovedToNewContainerRef,
}: UseDragHandlersArgs) {
  function findCategory(id: MoodId): MoodCollectionCategory | undefined {
    if (id in items) {
      return id as MoodCollectionCategory
    }
    return Object.keys(items).find((key) =>
      items[key as MoodCollectionCategory].includes(id),
    ) as MoodCollectionCategory | undefined
  }

  function onDragCancel() {
    if (cloned) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(cloned)
    }
    setCloned(null)

    setActiveId(null)
  }

  function onDragStart({ active }: DragStartEvent) {
    const activeId = active.id as MoodId
    setActiveId(activeId)
    // preserve original state before drag
    setCloned(items)
  }

  function onDragOver({ active, over }: DragOverEvent) {
    const overId = over?.id as MoodId | undefined
    if (overId == null || active.id in items) {
      return
    }

    const activeId = active.id as MoodId

    const toCategory = findCategory(overId)
    const fromCategory = findCategory(activeId)

    if (!toCategory || !fromCategory) {
      return
    }

    if (fromCategory !== toCategory) {
      setItems((items) => {
        const overItems = items[toCategory]
        const overIndex = overItems.indexOf(overId)

        let newIndex: number
        if (overId in items) {
          newIndex = overItems.length + 1
        } else {
          if (overIndex >= 0) {
            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height
            const modifier = isBelowOverItem ? 1 : 0
            newIndex = overIndex + modifier
          } else {
            newIndex = overItems.length + 1
          }
        }

        recentlyMovedToNewContainerRef.current = true

        const updated = moveInVirtualCollection(
          items,
          activeId,
          fromCategory,
          toCategory,
          newIndex,
        )
        return updated
      })
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const overId = over?.id as MoodId | undefined
    if (overId == null) {
      setActiveId(null)
      return
    }

    const activeId = active.id as MoodId

    const activeCategory = findCategory(activeId)
    if (!activeCategory) {
      setActiveId(null)
      return
    }

    const overCategory = findCategory(overId)

    if (overCategory) {
      const activeIndex = items[activeCategory].indexOf(activeId)
      const overIndex = items[overCategory].indexOf(overId)

      const newItems = {
        ...items,
        [overCategory]: arrayMove(items[overCategory], activeIndex, overIndex),
      }

      void updateMoodCollection(newItems)
      setItems(newItems)
    }

    setActiveId(null)
  }

  return { onDragCancel, onDragStart, onDragOver, onDragEnd }
}
