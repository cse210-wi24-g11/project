import { useState, useEffect } from 'react'
import { Button, Picker, Item, Key } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'
import { useParams } from 'react-router-dom'

import DisplayImageComponent from '@/components/custom-mood/display-image.tsx'
import ColorPicker from '@/components/custom-mood/color-picker.tsx' // Adjust the import path based on the actual location
import { useDb } from '@/context/db.tsx'

export function EditMood() {
  const { moodID } = useParams()
  const { getDb } = useDb()
  let moodBlob: Blob

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  )
  const [uploadedImage, setUploadedImage] = useState<string>(
    'src/assets/No-Image-Placeholder.png', //TODO: choose placeholder image
  )
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const [category, setCategory] = useState<Key>('general')

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Mood ID:', moodID)
        const db = await getDb()
        const moodRequest = db
          .transaction('mood', 'readwrite')
          .objectStore('mood')
          .get(moodID as string)

        const moodData = await new Promise<{ color: string; image: Blob }>(
          (resolve, reject) => {
            moodRequest.onsuccess = function (event) {
              const request = event.target as IDBRequest
              const data = request.result as { color: string; image: Blob }
              resolve(data)
            }

            moodRequest.onerror = function (event) {
              reject(event)
            }
          },
        )
        //get mood data to initalize components
        //moodRequest.onsuccess = function (event) {
        //const request = event.target as IDBRequest
        //const moodData = request.result as { color: string; image: Blob }

        if (moodData) {
          const blobUrl = URL.createObjectURL(moodData.image)
          console.log(blobUrl)
          setSelectedColor(moodData.color)
          setUploadedImage(blobUrl) // Set the image source to the Blob URL
          // URL.revokeObjectURL(blobUrl)

          //get category information and set picker
          try {
            const generalRequest = db
              .transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .get('general')

            generalRequest.onsuccess = function (event) {
              const request = event.target as IDBRequest
              const generalIDdata = request.result as { moods: string[] }
              if (generalIDdata.moods.includes(moodID as string)) {
                setCategory('general')
              }
            }
          } catch (error) {
            console.error('Error fetching "general" mood information:', error)
          }
          try {
            const favoriteRequest = db
              .transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .get('favorite')

            favoriteRequest.onsuccess = function (event) {
              const request = event.target as IDBRequest
              const favoriteIDdata = request.result as { moods: string[] }
              if (favoriteIDdata.moods.includes(moodID as string)) {
                setCategory('favorite')
              }
            }
          } catch (error) {
            console.error('Error fetching "favorite" mood information:', error)
          }
          try {
            const archivedRequest = db
              .transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .get('archived')

            archivedRequest.onsuccess = function (event) {
              const request = event.target as IDBRequest
              const archivedIDdata = request.result as { moods: string[] }
              if (archivedIDdata.moods.includes(moodID as string)) {
                setCategory('archived')
              }
            }
          } catch (error) {
            console.error('Error fetching "archived" mood information:', error)
          }
        } else {
          console.log('Invalid mood data')
        }
        //}
      } catch (error) {
        console.error('Error fetching mood information:', error)
      } //end fetchData
    }
    void fetchData()
    return () => {}
  }, [moodID, getDb]) // Dependency array to re-run the effect when moodID changes

  if (!moodID) {
    return <div> Invalid Mood ID </div>
  }

  const handleButtonPress = () => {
    handleEditMood()
      .then(() => {
        // Any additional synchronous logic after the asynchronous operations
      })
      .catch((error) => {
        // Handle any errors that occurred during the asynchronous operations
        console.error('Error in handleButtonPress:', error)
      })
  }

  async function handleEditMood() {
    let favoriteMoods: string[]
    let generalMoods: string[]
    let archivedMoods: string[]
    const db = await getDb()

    if (db) {
      //update mood to data base
      console.log('success: db connection is established')
      db.transaction('mood', 'readwrite')
        .objectStore('mood')
        .put({ id: moodID, color: selectedColor, image: moodBlob })

      //update categories (TODO: not working )

      //get category information and set picker

      try {
        const generalRequest = db
          .transaction('moodCollection', 'readwrite')
          .objectStore('moodCollection')
          .get('general')

        generalRequest.onsuccess = function (event) {
          const request = event.target as IDBRequest
          const generalIDdata = request.result as { moods: string[] }
          generalMoods = generalIDdata.moods
          //remove if no longer here
          if (
            generalMoods.includes(moodID as string) &&
            category != 'general'
          ) {
            generalMoods.splice(generalMoods.indexOf(moodID as string, 1))
          }
          //add if not yet in category
          else if (
            !generalMoods.includes(moodID as string) &&
            category == 'general'
          ) {
            generalMoods.push(moodID as string)
          }
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ category: 'general', moods: generalMoods })
        }
      } catch (error) {
        console.error('Error fetching "general" mood information:', error)
      }
      try {
        const favoriteRequest = db
          .transaction('moodCollection', 'readwrite')
          .objectStore('moodCollection')
          .get('favorite')

        favoriteRequest.onsuccess = function (event) {
          const request = event.target as IDBRequest
          const favoriteIDdata = request.result as { moods: string[] }
          favoriteMoods = favoriteIDdata.moods
          console.log(favoriteIDdata.moods)
          console.log(favoriteMoods)
          //remove if no longer here
          if (
            favoriteMoods.includes(moodID as string) &&
            category != 'favorite'
          ) {
            favoriteMoods.splice(favoriteMoods.indexOf(moodID as string, 1))
          }
          //add if not yet in category
          else if (
            !favoriteMoods.includes(moodID as string) &&
            category == 'favorite'
          ) {
            favoriteMoods.push(moodID as string)
          }
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ category: 'favorite', moods: favoriteMoods })
        }
      } catch (error) {
        console.error('Error fetching "favorite" mood information:', error)
      }
      try {
        const archivedRequest = db
          .transaction('moodCollection', 'readwrite')
          .objectStore('moodCollection')
          .get('archived')

        archivedRequest.onsuccess = function (event) {
          const request = event.target as IDBRequest
          const archivedIDdata = request.result as { moods: string[] }
          archivedMoods = archivedIDdata.moods
          //remove if no longer here
          if (
            archivedMoods.includes(moodID as string) &&
            category != 'archived'
          ) {
            archivedMoods.splice(archivedMoods.indexOf(moodID as string, 1))
          }
          //add if not yet in category
          else if (
            !archivedMoods.includes(moodID as string) &&
            category == 'archived'
          ) {
            archivedMoods.push(moodID as string)
          }
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ category: 'archived', moods: archivedMoods })
        }
      } catch (error) {
        console.error('Error fetching "archived" mood information:', error)
      }

      ToastQueue.positive(' Mood Updated!!', { timeout: 5000 })
    } else {
      console.log('error: db is still null')
    }
  }
  // Render your component with moodData
  //Add a delete button that will remove id from mood collection category arrays but not mood store
  // warn user that the action can not be reversed
  return (
    <div>
      <ToastContainer />
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
        <Item key="archived">Archived</Item>
      </Picker>
      <div>
        <Button onPress={handleButtonPress} variant="primary">
          Edit Mood
        </Button>
      </div>
    </div>
  )
}
