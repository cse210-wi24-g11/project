import { useState } from 'react'
import { Button, Picker, Item, Key } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import ImageUploadComponent from '@/components/custom-mood/upload-image.tsx'
import DisplayImageComponent from '@/components/custom-mood/display-image.tsx'
import ColorPicker from '@/components/custom-mood/color-picker.tsx' // Adjust the import path based on the actual location
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
// Define a function to generate a random UUID
const randomUUID = (): string => {
  const data = new Uint8Array(16)
  window.crypto.getRandomValues(data)

  // Set the version bits
  data[6] = (data[6] & 0x0f) | 0x40
  data[8] = (data[8] & 0x3f) | 0x80

  const hexString = Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return `${hexString.substr(0, 8)}-${hexString.substr(8, 4)}-${hexString.substr(12, 4)}-${hexString.substr(16, 4)}-${hexString.substr(20)}`
}

export function CustomMood() {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  )
  const [uploadedImage, setUploadedImage] = useState<string>(
    'src/assets/No-Image-Placeholder.png', //TODO: choose placeholder image
  )
  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
  }
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const [category, setCategory] = useState<Key>('general')
  const { getDb } = useDb()

  // Create a synchronous wrapper function for button press
  const handleButtonPress = () => {
    handleSubmitMood()
      .then(() => {
        // Any additional synchronous logic after the asynchronous operations
      })
      .catch((error) => {
        // Handle any errors that occurred during the asynchronous operations
        console.error('Error in handleButtonPress:', error)
      })
  }
  async function handleSubmitMood() {
    const db = await getDb()
    const blob = await getImageBlob(uploadedImage)
    if (blob) {
      console.log('Blob:', blob)
      if (db) {
        //add mood to data base
        const generatedUUID: string = randomUUID()
        console.log('success: db connection is established')
        db.transaction('mood', 'readwrite')
          .objectStore('mood')
          .put({ id: generatedUUID, color: selectedColor, image: blob })

        //append to favorite category
        if (category == 'favorite') {
          const favoritesRequest = db
            .transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .get('favorite')

          favoritesRequest.onsuccess = function (event) {
            const request = event.target as IDBRequest
            const favoriteIDdata = request.result as { moods: string[] }
            const storedFavoriteIDs = favoriteIDdata.moods
            storedFavoriteIDs.push(generatedUUID)
            db.transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .put({ category: 'favorite', moods: storedFavoriteIDs })
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
            const generalIDdata = request.result as { moods: string[] }
            const storedGeneralIDs = generalIDdata.moods
            storedGeneralIDs.push(generatedUUID)
            db.transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .put({ category: 'general', moods: storedGeneralIDs })
          }
        }
        ToastQueue.positive('Custom Mood Added!', { timeout: 5000 })
      } else {
        console.log('error: db is still null')
      }
    } else {
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
        <Button onPress={handleButtonPress} variant="primary">
          Submit Mood
        </Button>
      </div>
    </div>
  )
}
