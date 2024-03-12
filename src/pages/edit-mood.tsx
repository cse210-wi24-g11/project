import { useState, useEffect } from 'react'
import { Button, Picker, Item } from '@adobe/react-spectrum'
import { useParams } from 'react-router-dom'
import { ActionButton } from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import { db } from '@/db/index.ts'
import { getMoodIdsInCategory, moveOrAddToInCollection } from '@/db/actions.ts'
import { base64ToBlob, blobToUrl, createMood } from '@/db/utils.ts'

import { DisplayImageComponent } from '@/components/custom-mood/display-image.tsx'

import type { MoodCollectionCategory } from '@/db/types.ts'

export function EditMood() {
  const navigate = useNavigate()
  const { moodId } = useParams()

  const [moodBlob, setMoodBlob] = useState<Blob | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#000000')
  const [uploadedImage, setUploadedImage] = useState<string>(
    'src/assets/No-Image-Placeholder.png',
  )

  const [category, setCategory] = useState<MoodCollectionCategory>('general')

  useEffect(() => {
    async function fetchData() {
      const mood = (await db.moods.get(moodId!))!
      const blob = await base64ToBlob(mood.image)
      const blobUrl = blobToUrl(blob)

      setMoodBlob(blob)
      setSelectedColor(mood.color)
      setUploadedImage(blobUrl)

      for (const cat of ['general', 'favorites', 'archived'] as const) {
        const collection = await getMoodIdsInCategory(cat)
        if (collection.includes(mood.id)) {
          setCategory(cat)
          break
        }
      }
    }
    void fetchData()
  }, [moodId])

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
    const mood = await createMood(selectedColor, moodBlob!, moodId)
    await db.moods.put(mood)

    //update categories (TODO: not working )
    // get category information and set picker
    await moveOrAddToInCollection(mood.id, category)
  }
  // Render your component with moodData
  // NOTE: warn user that the choosing archived means mood can not be retrieved
  return (
    <>
      <div
        className="rounded-lg"
        style={{ border: `20px solid ${selectedColor}`, padding: '1px' }}
      >
        <DisplayImageComponent uploadedImage={uploadedImage} />
      </div>
      <Picker
        selectedKey={category}
        onSelectionChange={(selected) =>
          setCategory(selected as MoodCollectionCategory)
        }
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
    </>
  )
}
