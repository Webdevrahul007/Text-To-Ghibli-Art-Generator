'use client'

import { useAppStore } from '@/lib/store'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export function UserGallery() {
  const { galleryImages } = useAppStore()
  const [likedImages, setLikedImages] = useState<Record<string, boolean>>({})

  if (galleryImages.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Add your favorite generated images to this gallery!
        </p>
      </div>
    )
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      // For data URLs, we can extract the base64 part
      const base64Data = imageUrl.split(',')[1]
      if (!base64Data) {
        throw new Error('Invalid image data')
      }

      // Create blob from base64
      const byteCharacters = atob(base64Data)
      const byteArrays = []
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i))
      }
      const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url

      // Create a safe filename from the prompt
      const safePrompt = prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()
      link.download = `ghibli-gallery-${safePrompt}-${Date.now()}.jpg`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Image downloaded')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const toggleLike = (id: string) => {
    setLikedImages(prev => ({
      ...prev,
      [id]: !prev[id]
    }))

    if (!likedImages[id]) {
      toast.success('Added to favorites')
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {galleryImages.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="p-3 pb-0">
            <div className="text-xs truncate font-medium" title={item.prompt}>
              {item.prompt}
            </div>
            <div className="text-xs text-muted-foreground">
              Generated with {item.model}
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-2 relative group">
            <Image
              src={item.imageUrl}
              alt={item.prompt}
              width={512}
              height={512}
              className="w-full h-auto object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/40 border-white/20 text-white"
                onClick={() => handleDownload(item.imageUrl, item.prompt)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${likedImages[item.id] ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={() => toggleLike(item.id)}
            >
              <Heart className={`h-4 w-4 ${likedImages[item.id] ? 'fill-current' : ''}`} />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
