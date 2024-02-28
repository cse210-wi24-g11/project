import React, { useState } from 'react'
import { Button, Picker, Item } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import ColorPicker from '@/components/ColorPicker.tsx'
import ImageUploadComponent from '@/components/UploadImage.tsx'
import DisplayImageComponent from '@/components/DisplayImage.tsx'

//import { useParams } from 'react-router-dom';

const EditMoodPage: React.FC = () => {
  //const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  ) //set to data base value
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    './assets/No-Image-Placeholder.png',
  ) //set to database value

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
  }
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }
  const handleSubmitMood = () => {
    if (!isSubmitDisabled) {
      ToastQueue.positive('Edited Mood!') //add alert to have user confirm that all previous usages of this mood will change accordingly
    }
    // Save the mood data to local storage general mood collection or data base
    //banner with success of uploaded mood, refresh page
    //selectedColor..., uploadedImage...
  }
  const isSubmitDisabled = !selectedColor || !uploadedImage //test this

  return (
    <div>
      <ToastContainer />
      <ImageUploadComponent
        onImageUpload={handleImageUpload}
        uploadedImage={uploadedImage}
      />
      <div
        className=" rounded-lg"
        style={{ border: `20px solid ${selectedColor}`, padding: '1px' }}
      >
        <DisplayImageComponent uploadedImage={uploadedImage} />
      </div>
      <ColorPicker color={selectedColor} onChange={handleColorChange} />
      <Picker>
        <Item key="favorite">Favorite</Item>
        <Item key="general">General</Item>
        <Item key="archived">Archived</Item>
      </Picker>
      <div>
        <Button onPress={handleSubmitMood} variant="primary">
          Edit Mood
        </Button>
      </div>
    </div>
  )
}

export default EditMoodPage
