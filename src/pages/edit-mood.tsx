import { useState, useEffect, MutableRefObject, useRef } from 'react'
import { Button, Picker, Item, Key } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'
import { useParams } from 'react-router-dom'
import { ActionButton } from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import { DisplayImageComponent } from '@/components/custom-mood/display-image.tsx'
import { useDb } from '@/context/db.tsx'

export function EditMood() {
  const navigate = useNavigate()

  const { moodId } = useParams()
  const { getDb } = useDb()
  const moodBlob: MutableRefObject<Blob | null> = useRef<Blob | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    '#000000',
  )
  const [uploadedImage, setUploadedImage] = useState<string>(
    'src/assets/No-Image-Placeholder.png',
  )

  const [category, setCategory] = useState<Key>('general')

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Mood ID:', moodId)
        const db = await getDb()
        const moodRequest = db
          .transaction('mood', 'readwrite')
          .objectStore('mood')
          .get(moodId as string)

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

        if (moodData) {
          const blobUrl = URL.createObjectURL(moodData.image)
          console.log(blobUrl)
          moodBlob.current = moodData.image
          setCategory(moodData.color)
          setSelectedColor(moodData.color)
          setUploadedImage(blobUrl) // Set the image source to the Blob URL

          //get category information and set picker
          try {
            const generalRequest = db
              .transaction('moodCollection', 'readwrite')
              .objectStore('moodCollection')
              .get('general')

            generalRequest.onsuccess = function (event) {
              const request = event.target as IDBRequest
              const generalIds = request.result as string[]
              if (generalIds.includes(moodId as string)) {
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
              const favoritesIds = request.result as string[]
              if (favoritesIds.includes(moodId as string)) {
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
              const archivedIds = request.result as string[]
              if (archivedIds.includes(moodId as string)) {
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
  }, [moodId, getDb]) // Dependency array to re-run the effect when moodID changes

  if (!moodId) {
    return (
      <div>
        <ActionButton onPress={() => navigate(-1)}>Back</ActionButton>
        <div> Invalid Mood ID </div>
      </div>
    )
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
    const db = await getDb()

    if (db) {
      //update mood to data base
      console.log('success: db connection is established')
      db.transaction('mood', 'readwrite')
        .objectStore('mood')
        .put({ id: moodId, color: selectedColor, image: moodBlob.current })

      //update categories (TODO: not working )

      //get category information and set picker

      try {
        const generalRequest = db
          .transaction('moodCollection', 'readwrite')
          .objectStore('moodCollection')
          .get('general')

        generalRequest.onsuccess = function (event) {
          const request = event.target as IDBRequest
          const generalIds = request.result as string[]
          //remove if no longer here
          if (generalIds.includes(moodId!) && category != 'general') {
            generalIds.splice(generalIds.indexOf(moodId!, 1))
          }
          //add if not yet in category
          else if (!generalIds.includes(moodId!) && category == 'general') {
            generalIds.push(moodId!)
          }
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put(generalIds, 'general')
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
          const favoritesIds = request.result as string[]
          console.log(favoritesIds)
          //remove if no longer here
          if (favoritesIds.includes(moodId!) && category != 'favorite') {
            favoritesIds.splice(favoritesIds.indexOf(moodId!, 1))
          }
          //add if not yet in category
          else if (!favoritesIds.includes(moodId!) && category == 'favorite') {
            favoritesIds.push(moodId!)
          }
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put(favoritesIds, 'favorite')
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
          const archivedIds = request.result as string[]
          //remove if no longer here
          if (archivedIds.includes(moodId!) && category != 'archived') {
            archivedIds.splice(archivedIds.indexOf(moodId!, 1))
          }
          //add if not yet in category
          else if (!archivedIds.includes(moodId!) && category == 'archived') {
            archivedIds.push(moodId!)
          }
          db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put(archivedIds, 'archived')
        }
      } catch (error) {
        console.error('Error fetching "archived" mood information:', error)
      }

      ToastQueue.positive(' Mood Collection Updated!!', { timeout: 5000 })
    } else {
      console.log('error: db is still null')
    }
  }
  // Render your component with moodData
  // NOTE: warn user that the choosing archived means mood can not be retrieved
  return (
    <div>
      <ToastContainer />
      <div
        className="rounded-lg"
        style={{ border: `20px solid ${selectedColor}`, padding: '1px' }}
      >
        <DisplayImageComponent uploadedImage={uploadedImage} />
      </div>
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
          Change Category
        </Button>
      </div>
    </div>
  )
}
