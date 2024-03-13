import { MouseEventHandler, useMemo } from 'react'

type MoodSwatchSize = 'single-line-height' | '2rem' | 'full' | { width: string }

type MoodSwatchColor = string

export interface MoodSwatchProps {
  size: MoodSwatchSize
  imgSrc?: string
  color?: MoodSwatchColor
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function MoodSwatch({ size, imgSrc, color, onClick }: MoodSwatchProps) {
  const style = useMemo(
    () => (typeof size === 'object' ? size : undefined),
    [size],
  )
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`relative m-0 rounded-full border border-black bg-white p-0 ${resolveSizeClassname(size)}`}
      style={style}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      )}
      {color && <ColorPreview color={color} />}
    </div>
  )
}

type ColorPreviewProps = {
  color: MoodSwatchColor
}

function ColorPreview({ color }: ColorPreviewProps) {
  return (
    <div className="absolute right-[6.25%] top-[6.25%] h-1/4 w-1/4 rounded-[6.25%] bg-black p-[1.5625%]">
      <div className="`w-full h-full" style={{ backgroundColor: color }} />
    </div>
  )
}

function resolveSizeClassname(size: MoodSwatchSize) {
  switch (size) {
    case 'single-line-height': {
      return 'w-single-line-height h-single-line-height'
    }
    case '2rem': {
      return 'w-8 h-8'
    }
    case 'full': {
      return 'w-full h-full'
    }
  }

  if (typeof size === 'object') {
    return 'aspect-square'
  }

  throw new Error('unrecognized size')
}
