import { MouseEventHandler } from 'react'

type MoodSwatchSize = 'single-line-height'

type MoodSwatchColor = string

interface MoodSwatchProps {
  size: MoodSwatchSize
  imgSrc?: string
  color?: MoodSwatchColor
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function MoodSwatch({ size, imgSrc, color, onClick }: MoodSwatchProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`relative m-0 rounded-full border border-black bg-white p-0 ${resolveSizeClassname(size)}`}
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
  if (size === 'single-line-height') {
    return 'w-single-line-height h-single-line-height'
  }

  throw new Error('unrecognized size')
}
