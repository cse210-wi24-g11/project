import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Picker, Item } from '@adobe/react-spectrum'

import { db } from '@/db/index.ts'
import { createMood, urlToBlob } from '@/db/utils.ts'
import imagePlaceholderUrl from '@/assets/No-Image-Placeholder.png'
import { MOOD_COLLECTION_ROUTE } from '@/routes.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { ColorPicker } from '@/components/custom-mood/color-picker.tsx' // Adjust the import path based on the actual location
import { ImageUploadComponent } from '@/components/custom-mood/upload-image.tsx'
import { DisplayImageComponent } from '@/components/custom-mood/display-image.tsx'

import type { MoodCollectionCategory } from '@/db/types.ts'
import background from "@/assets/background.png"

type PickerOptions<KeyType extends React.Key> = Array<{
  key: KeyType
  label: string
}>

const categoryOptions: PickerOptions<MoodCollectionCategory> = [
  { key: 'favorites', label: 'Favorites' },
  { key: 'general', label: 'General' },
]

export function CustomMood() {
  const navigate = useNavigate()
  const [selectedColor, setSelectedColor] = useState<string>('#000000') // default white
  const [uploadedImage, setUploadedImage] =
    useState<string>(imagePlaceholderUrl)

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
  }
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }
  const moodCollection = () => {
    navigate(MOOD_COLLECTION_ROUTE)
  }

  const [category, setCategory] = useState<MoodCollectionCategory>('general')

  async function handleSubmitMood() {
    // Ensure that ToastQueue is properly typed and positive is accessed on the correct object/type
    //if (!submitDisabled){
    const blob = await urlToBlob(uploadedImage)
    if (!blob) {
      // TODO: render a floating window to notify the user to upload an image
      console.log('Failed to fetch image as Blob.')
      return
    }

    // Now you can use the 'blob' object as needed, e.g., in your IndexedDB code
    console.log('Blob:', blob)

    //add mood to data base
    const mood = await createMood(selectedColor, blob)
    await db.moods.add(mood)

    //append to category in mood collection
    const collection = (await db.moodCollection.get(category)) ?? []
    collection.push(mood.id)
    await db.moodCollection.put(collection, category)

    moodCollection()
  }

  return (
    <div style={{backgroundImage: `url(${background})`}}>
      <div className="mt-12 flex flex-col items-center space-y-4">
        <ImageUploadComponent
          onImageUpload={handleImageUpload}
          uploadedImage={uploadedImage}
        />
        <div
          className="m-4 h-max w-max rounded-lg"
          style={{ border: `20px solid ${selectedColor}` }}
        >
          <DisplayImageComponent uploadedImage={uploadedImage} />
        </div>
        <ColorPicker color={selectedColor} onChange={handleColorChange} />
        <Picker
          items={categoryOptions}
          selectedKey={category}
          onSelectionChange={(selected) =>
            setCategory(selected as MoodCollectionCategory)
          }
        >
          {(categoryOptions) => <Item>{categoryOptions.label}</Item>}
        </Picker>
        <div>
          <Button onPress={() => void handleSubmitMood()} variant="primary">
            Submit Mood
          </Button>
        </div>
      </div>
      <MainNavBar />
    </div>
  )
}
