import { useState } from 'react'
import { Button, Picker, Item, Key } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import ColorPicker from '@/components/ColorPicker.tsx' // Adjust the import path based on the actual location
import ImageUploadComponent from '@/components/UploadImage.tsx'
import DisplayImageComponent from '@/components/DisplayImage.tsx'
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

function CustomMood() {
  const { getDb } = useDb()

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  ) // default white
  const [uploadedImage, setUploadedImage] = useState<string>(
    'src/assets/No-Image-Placeholder.png',
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
      const generatedUUID: string = randomUUID()
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
          let favoriteIDdata: { moods: string[] }

          if (request.result) {
            // If the favorite record exists, use it
            favoriteIDdata = request.result as { moods: string[] }
          } else {
            // If the favorite record doesn't exist, create a new one
            favoriteIDdata = { moods: [] }
          }

          const storedFavoriteIDs = favoriteIDdata.moods
          storedFavoriteIDs.push(generatedUUID)
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ moods: storedFavoriteIDs }, 'favorite')
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
          let generalIDdata: { moods: string[] }

          if (request.result) {
            // If the favorite record exists, use it
            generalIDdata = request.result as { moods: string[] }
          } else {
            // If the favorite record doesn't exist, create a new one
            generalIDdata = { moods: [] }
          }

          const storedGeneralIDs = generalIDdata.moods
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
        <Button onPress={handleSubmitMood} variant="primary">
          Submit Mood
        </Button>
      </div>
      <MainNavBar />
    </div>
  )
}

export default CustomMood
