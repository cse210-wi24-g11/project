// src/components/mood_icon/MoodIcon.tsx
import React from 'react';
import { useLongPress } from "../components/useLongPress";
import { useNavigate } from 'react-router-dom';

export type MoodIconProps = {
  color: string;
  image_URL: string;
  id: number;
};

const MoodIcon: React.FC<MoodIconProps> = ({ color, image_URL, id }) => {
 
  const navigate = useNavigate();

  const onLongPress = useLongPress(() => {
    // TODO: Navigate to EditMoodPage
    navigate(`/EditMoodPage/${id}`);
  }, 500);

  return (

    <div 
    className={`border-${color} border-4 p-2 rounded-md`}
    {...onLongPress}
    >
      <img src={image_URL} className='w-10 h-10 object-cover rounded-lg' alt={`Mood ${id}`} />
    </div>
    
  );
};

export default MoodIcon;
