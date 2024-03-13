/* eslint-disable react/prop-types -- rule doesn't seem to work properly with the memo */

import { CSSProperties, forwardRef, memo, useEffect, useMemo } from 'react'

import { cls } from '@/utils/cls.ts'

import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

export interface ItemProps {
  dragOverlay?: boolean
  dragging?: boolean
  height?: number
  fadeIn?: boolean
  transform?: Transform | null
  listeners?: DraggableSyntheticListeners
  style?: CSSProperties
  transition?: string | null
  children: JSX.Element
}

export const Item = memo(
  forwardRef<HTMLLIElement, ItemProps>(
    (
      {
        dragOverlay,
        dragging,
        fadeIn,
        listeners,
        style,
        transition,
        transform,
        children,
      }: ItemProps,
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return
        }
        document.body.style.cursor = 'grabbing'
        return () => {
          document.body.style.cursor = ''
        }
      }, [dragOverlay])

      const transformProperties = useMemo(() => {
        return {
          '--translate-x': transform ? `${Math.round(transform.x)}px` : '0',
          '--translate-y': transform ? `${Math.round(transform.y)}px` : '0',
          '--scale-x': transform?.scaleX ? `${transform.scaleX}` : '1',
          '--scale-y': transform?.scaleY ? `${transform.scaleY}` : '1',
        } as const
      }, [transform])

      const wrapperStyle = useMemo<CSSProperties>(
        () => ({
          transition: transition ?? undefined,
          ...transformProperties,
          transform:
            'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
        }),
        [transformProperties, transition],
      )

      return (
        <li
          className={cls(
            'w-full',
            'flex',
            // dunno why but they wouldnt properly animate and were slow with classnames :(
            // [
            //   'translate-x-[var(--translate-x,0)]', 'translate-y-[var(--translate-y,0)]',
            //   'scale-x-[var(--scale-x,0)]', 'scale-y-[var(--scale-y),0]',
            // ],
            'origin-top-left',
            'touch-manipulation',
            fadeIn && 'animation-[fadeIn 500ms ease]',
            dragOverlay && 'z-50',
          )}
          style={wrapperStyle}
          ref={ref}
        >
          <div
            className={cls(
              [
                'relative',
                'grow',
                'w-full',
                'h-full',
                // 'flex items-center',
                'rounded-full',
              ],
              // todo: the size of this wrapper div exceeds the child when width is large (e.g. desktop),
              // so its shape is a pill not a circle, and the shadow shows the pill.
              dragging &&
                !dragOverlay && ['opacity-50', 'z-0' /*'focus:shadow-sm'*/],
              dragOverlay && ['cursor-[inherit]', 'scale-105' /*'shadow-md'*/],
            )}
            style={style}
            {...listeners}
            tabIndex={0}
          >
            {children}
          </div>
        </li>
      )
    },
  ),
)
