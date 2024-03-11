import { useEffect, useState } from 'react'

import imagePlaceholderUrl from '@/assets/No-Image-Placeholder.png'

//display image
interface DisplayImageProps {
  uploadedImage: string | null
}
export function DisplayImageComponent({ uploadedImage }: DisplayImageProps) {
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
        <img
          src={imagePlaceholderUrl} //TODO: choose placeholder image
          className="h-56 w-56 rounded-lg object-cover"
        />
      )}
    </div>
  )
}
