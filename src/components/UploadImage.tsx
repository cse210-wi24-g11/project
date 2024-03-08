import React, { useRef, ChangeEvent } from 'react'
import { Button, Text } from '@adobe/react-spectrum'

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void
  uploadedImage: string | null
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({
  onImageUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageData = e.target?.result as string
        onImageUpload(imageData) // Update the parent state with the uploaded image data
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Button variant="primary" onPress={handleClick}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <Text>Upload Custom Mood Icon</Text>
    </Button>
  )
}
export default ImageUploadComponent
