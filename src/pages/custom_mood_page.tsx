import { useState ,useEffect, SetStateAction} from 'react'
import { Button, Picker, Item,Key } from '@adobe/react-spectrum'
import { ToastContainer, ToastQueue } from '@react-spectrum/toast'

import ColorPicker from '@/components/ColorPicker.tsx' // Adjust the import path based on the actual location
import ImageUploadComponent from '@/components/UploadImage.tsx'
import DisplayImageComponent from '@/components/DisplayImage.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar'

import { useDb } from '@/context/db.tsx'

// Function to fetch image as Blob from a given URL
const getImageBlob = async (imageUrl: string ) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching image as Blob:', error);
    return null;
  }
};
interface CustomPickerProps {
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
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
    submitDisabled = false;
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  let [category, setCategory] = useState<Key>("general");

  

 const db = useDb()
 async function handleSubmitMood() {
      // Ensure that ToastQueue is properly typed and positive is accessed on the correct object/type
      //if (!submitDisabled){
        const blob = await getImageBlob(uploadedImage);
        if (blob) {
          // Now you can use the 'blob' object as needed, e.g., in your IndexedDB code
          console.log('Blob:', blob);
          if (db) {
            console.log('success: db connection is established')
             db.transaction('mood', 'readwrite')
              .objectStore('mood')
              .put({ id: '12345', color: selectedColor, image: new Blob() })

            
            const favoriteIDs: number[] = [];
            const generalIDs: number[] = [];
            const archivedIDs:number[] = [];
            //get favorites, append and then push? 
            if(category == 'favorite'){
                favoriteIDs.push(12345)
                db.transaction('moodCollection', 'readwrite')
                .objectStore('moodCollection')
                .put({ id: 'general', generalMoods: generalIDs })

            }
            //get general, append and then push? 
            else{
              generalIDs.push(12345)
              db.transaction('moodCollection', 'readwrite')
             .objectStore('moodCollection')
             .put({ id: 'general', generalMoods: generalIDs })
            
            }
           ToastQueue.positive('Custom Mood Added!')
             
          } else {
            console.log('error: db is still null')
          }
        } else {
          console.log('Failed to fetch image as Blob.');
        }
    //}
    // Save the mood data to local storage general mood collection or database
    // Banner with success of uploaded mood, refresh page
    // selectedColor..., uploadedImage...
  }

  var submitDisabled = true; // test this

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
      onSelectionChange={selected => setCategory(selected)}>
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
