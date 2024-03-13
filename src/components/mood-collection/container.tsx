import React, { forwardRef } from 'react'

import { cls } from '@/utils/cls.ts'

export interface ContainerProps {
  children: React.ReactNode
  hover?: boolean
  style?: React.CSSProperties
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, hover, style }: ContainerProps, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={cls('w-full p-4', hover && 'bg-cyan-50')}
      >
        <ul
          style={{ gap: '5%' }}
          className={cls('w-full', 'grid grid-cols-5', 'list-none')}
        >
          {children}
        </ul>
      </div>
    )
  },
)
Container.displayName = 'Container'
