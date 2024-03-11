// src/components/mood_icon/MoodIcon.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useLongPress } from './useLongPress.tsx'


export type MoodIconProps = {
  color: string
  imageURL: string
  id: number
}

export const MoodIcon: React.FC<MoodIconProps> = function({ color, imageURL, id }) {
  const navigate = useNavigate()

  const onLongPress = useLongPress(() => {
    // TODO: Navigate to EditMoodPage
    navigate()
  }, 500)

  return (
    <div className={`border-${color} rounded-md border-4 p-2`} {...onLongPress}>
      <img
        src={imageURL}
        className="h-10 w-10 rounded-lg object-cover"
        alt={`Mood ${id}`}
      />
    </div>
  )
}