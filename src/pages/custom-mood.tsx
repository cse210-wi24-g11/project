import { useState } from 'react'
import { Button, Picker, Item, Key } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import imagePlaceholderUrl from '@/assets/image-path.png'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import {ColorPicker} from '@/components/custom-mood/color-picker.tsx' // Adjust the import path based on the actual location
import {ImageUploadComponent} from '@/components/custom-mood/upload-image.tsx'
import {DisplayImageComponent} from '@/components/custom-mood/display-image.tsx'
import { useDb } from '@/context/db.tsx'


// Function to fetch image as Blob from a given URL
const getImageBlob = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('Error fetching image as Blob:', error)
    return null
  }
}


export function CustomMood() {
  const { getDb } = useDb()

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  ) // default white
  const [uploadedImage, setUploadedImage] = useState<string>(
    imagePlaceholderUrl ,
  )

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
  }
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const [category, setCategory] = useState<Key>('general')

  async function handleSubmitMood() {
    const db = await getDb()

    // Ensure that ToastQueue is properly typed and positive is accessed on the correct object/type
    //if (!submitDisabled){
    const blob = await getImageBlob(uploadedImage)
    if (blob) {
      // Now you can use the 'blob' object as needed, e.g., in your IndexedDB code
      console.log('Blob:', blob)

      //add mood to data base
      const generatedUUID: string = window.crypto.randomUUID()
      db.transaction('mood', 'readwrite')
        .objectStore('mood')
        .add({ id: generatedUUID, color: selectedColor, image: blob })

      //append to favorite category
      if (category == 'favorite') {
        const favoritesRequest = db
          .transaction('moodCollection', 'readwrite')
          .objectStore('moodCollection')
          .get('favorite')

        // console.log(favoritesRequest)

        favoritesRequest.onsuccess = function (event) {
          const request = event.target as IDBRequest
          let favoriteIdData: { moods: string[] }

          if (request.result) {
            // If the favorite record exists, use it
            favoriteIdData = request.result as { moods: string[] }
          } else {
            // If the favorite record doesn't exist, create a new one
            favoriteIdData = { moods: [] }
          }

          const storedFavoriteIds = favoriteIdData.moods
          storedFavoriteIds.push(generatedUUID)
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ moods: storedFavoriteIds }, 'favorite')
        }
      }
      //append to general category
      else {
        const generalRequest = db
          .transaction('moodCollection', 'readwrite')
          .objectStore('moodCollection')
          .get('general')

        generalRequest.onsuccess = function (event) {
          const request = event.target as IDBRequest
          let generalIdData: { moods: string[] }

          if (request.result) {
            // If the favorite record exists, use it
            generalIdData = request.result as { moods: string[] }
          } else {
            // If the favorite record doesn't exist, create a new one
            generalIdData = { moods: [] }
          }

          const storedGeneralIDs = generalIdData.moods
          storedGeneralIDs.push(generatedUUID)
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ moods: storedGeneralIDs }, 'general')
        }
      }
      ToastQueue.positive('Custom Mood Added!', { timeout: 5000 })
    } else {
      // TODO: render a floating window to notify the user to upload an image
      console.log('Failed to fetch image as Blob.')
    }
  }

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
      <Picker
        selectedKey={category}
        onSelectionChange={(selected) => setCategory(selected)}
      >
        <Item key="favorite">Favorite</Item>
        <Item key="general">General</Item>
      </Picker>
      <div>
        <Button onPress={() => void handleSubmitMood()} variant="primary">
          Submit Mood
        </Button>
      </div>
      <MainNavBar />
    </div>
  )
}
