import {
  DropAnimation,
  MeasuringConfiguration,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable'

export const measuringConfiguration: MeasuringConfiguration = {
  droppable: { strategy: MeasuringStrategy.Always },
}

export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })
