import { Button, Text } from '@adobe/react-spectrum'
import React from 'react'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
//import { useDrag, useDrop } from 'react-dnd'

import MoodIcon from '@/components/MoodIcon.tsx'
type Mood = {
  color: string
  image: string
  id: number
}

//favorite section
export type MoodSectionProps = {
  moods: Mood[]
}

const MoodSection: React.FC<MoodSectionProps> = ({ moods }) => {
  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        <MoodIcon
          key={i}
          color={mood.color}
          image_URL={mood.image}
          id={mood.id}
        />
      ))}
    </div>
  )
}

function MoodCollectionPage() {
  //TODO: dummy data, replace with function calls to dB
  const mood1: Mood = {
    color: '#555555', // Set a default color
    image: '', // Set a default image URL or leave it empty
    id: 1, // Set a default ID
  }
  const mood2: Mood = {
    color: '#ffffff', // Set a default color
    image: '', // Set a default image URL or leave it empty
    id: 2, // Set a default ID
  }
  const mood3: Mood = {
    color: '#ffffff', // Set a default color
    image: '', // Set a default image URL or leave it empty
    id: 3, // Set a default ID
  }
  const mood4: Mood = {
    color: '#ffffff', // Set a default color
    image: '', // Set a default image URL or leave it empty
    id: 4, // Set a default ID
  }
  const mood5: Mood = {
    color: '#ffffff', // Set a default color
    image: '', // Set a default image URL or leave it empty
    id: 5, // Set a default ID
  }
  const mood6: Mood = {
    color: '#ffffff', // Set a default color
    image: '', // Set a default image URL or leave it empty
    id: 6, // Set a default ID
  }

  const favoriteMoods: Mood[] = [mood1, mood2, mood3, mood4, mood5, mood6] //get_favorite_moods()?!?
  //const generalMoods: Mood[] = [mood1, mood2, mood3, mood4, mood5] //get_general_moods()?!?
  //const archivedMoods: Mood[] = [mood1, mood2, mood3, mood4, mood5] //get_archived_moods()?!?
  //const navigate = useNavigate();

  const handleClick = () => {
    //open custom mood page
    // navigate(`/CustomMoodPage`);
  }
  return (
    <>
      <div>
        <Button variant="primary" onPress={handleClick}>
          <Text>Add New Mood</Text>
        </Button>
        <h1>Favorites</h1>
        <MoodSection moods={favoriteMoods} />
        <h1>General</h1>
        <MoodSection moods={favoriteMoods} />
        <h1>Archived</h1>
        <MoodSection moods={favoriteMoods} />
      </div>
      <MainNavBar />
    </>
  )
}

export default MoodCollectionPage
