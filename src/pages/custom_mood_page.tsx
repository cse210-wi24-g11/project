import { useState } from 'react'
import { Button, Picker, Item } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import ColorPicker from '@/components/ColorPicker.tsx'
import ImageUploadComponent from '@/components/UploadImage.tsx'
import DisplayImageComponent from '@/components/DisplayImage.tsx'

function CustomMoodPage() {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  ) //default white
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    'src/assets/No-Image-Placeholder.svg',
  )
  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
  }
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }
  const handleSubmitMood = () => {
    if (!isSubmitDisabled) {
      ToastQueue.positive('Custom Mood Added!')
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
      </Picker>
      <div>
        <Button onPress={handleSubmitMood} variant="primary">
          Submit Mood
        </Button>
      </div>
    </div>
  )
}

export default CustomMoodPage
