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

function CustomMoodPage() {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  ) // default white
  const [uploadedImage, setUploadedImage] = useState<string>(
    'src/assets/No-Image-Placeholder.png',
  )

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
    submitDisabled = false
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const [category, setCategory] = useState<Key>('general')

  const db = useDb()
  async function handleSubmitMood() {
    // Ensure that ToastQueue is properly typed and positive is accessed on the correct object/type
    //if (!submitDisabled){
    const blob = await getImageBlob(uploadedImage)
    if (blob) {
      // Now you can use the 'blob' object as needed, e.g., in your IndexedDB code
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
            const favoriteIDdata = request.result
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
            const generalIDdata = request.result
            const storedGeneralIDs = generalIDdata.moods
            storedGeneralIDs.push(generatedUUID)
            db.transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .put({ category: 'general', moods: storedGeneralIDs })
          }
        }
        ToastQueue.positive('Custom Mood Added!')
      } else {
        console.log('error: db is still null')
      }
    } else {
      console.log('Failed to fetch image as Blob.')
    }
    //}
    // Save the mood data to local storage general mood collection or database
    // Banner with success of uploaded mood, refresh page
    // selectedColor..., uploadedImage...
  }

  var submitDisabled = true // test this

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

export default CustomMoodPage
