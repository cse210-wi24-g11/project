import React, { useState } from 'react'
import { Button, Picker, Item } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import ColorPicker from '@/components/ColorPicker.tsx' // Adjust the import path based on the actual location
import ImageUploadComponent from '@/components/UploadImage.tsx'
import DisplayImageComponent from '@/components/DisplayImage.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar'

const EditMoodPage: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  ) // set to database value
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    './assets/No-Image-Placeholder.png',
  ) // set to database value

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const handleSubmitMood = () => {
    if (!isSubmitDisabled) {
      // Ensure that ToastQueue is properly typed and positive is accessed on the correct object/type
      ToastQueue.positive('Edited Mood!') // add alert to have the user confirm that all previous usages of this mood will change accordingly
    }
    // Save the mood data to local storage general mood collection or database
    // Banner with success of edited mood, refresh page
    // selectedColor..., uploadedImage...
  }

  const isSubmitDisabled = !selectedColor || !uploadedImage // test this

  return (
    <div>
      <ToastContainer />
      <ImageUploadComponent
        onImageUpload={handleImageUpload}
        uploadedImage={uploadedImage}
      />
      <div
        className="rounded-lg"
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
      <MainNavBar />
    </div>
  )
}

export default EditMoodPage
