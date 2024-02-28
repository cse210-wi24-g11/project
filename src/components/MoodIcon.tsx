// src/components/mood_icon/MoodIcon.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useLongPress } from './useLongPress.tsx'

export type MoodIconProps = {
  color: string
  image_URL: string
  id: number
}

const MoodIcon: React.FC<MoodIconProps> = ({ color, image_URL, id }) => {
  const navigate = useNavigate()

  const onLongPress = useLongPress(() => {
    // TODO: Navigate to EditMoodPage
    navigate(`/EditMoodPage/${id}`)
  }, 500)

  return (
    <div className={`border-${color} rounded-md border-4 p-2`} {...onLongPress}>
      <img
        src={image_URL}
        className="h-10 w-10 rounded-lg object-cover"
        alt={`Mood ${id}`}
      />
    </div>
  )
}

export default MoodIcon
