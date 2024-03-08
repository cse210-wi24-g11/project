import React, { useEffect, useState } from 'react'

//display image
interface DisplayImageProps {
  uploadedImage: string | null
}

const DisplayImageComponent: React.FC<DisplayImageProps> = ({
  uploadedImage,
}) => {
  const [imageData, setImageData] = useState<string | null>(uploadedImage)
  useEffect(() => {
    // Update the image data whenever uploadedImage changes
    setImageData(uploadedImage)
  }, [uploadedImage])

  return (
    <div>
      {imageData ? (
        <img src={imageData} className="h-56 w-56 rounded-lg object-cover" />
      ) : (
        //need to decide on ddefault image as a group
        <img
          src="src/assets/No-Image-Placeholder.png"
          className="h-56 w-56 rounded-lg object-cover"
        /> //replace with a no image preview of equal size
      )}
    </div>
  )
}

export default DisplayImageComponent
