'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

interface ImageDisplayProps {
  imageUrl: string | null
}

export function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { addToGallery, history } = useAppStore()

  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ghibli-art-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Image downloaded successfully!')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const handleAddToGallery = () => {
    if (imageUrl && history.length > 0) {
      // Find the most recent image in history that matches this URL
      const latestImage = history.find(item => item.imageUrl === imageUrl)

      if (latestImage) {
        addToGallery(latestImage)
        toast.success('Added to gallery!')
      }
    }
  }

  if (!imageUrl) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex h-[500px] items-center justify-center bg-muted/30 p-6 text-center text-muted-foreground">
            <p>Your Ghibli-style artwork will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        <Image
          src={imageUrl}
          alt="Generated Ghibli-style art"
          width={1024}
          height={768}
          className="w-full h-auto object-contain"
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleAddToGallery}
            className="rounded-full bg-black/50 hover:bg-black/70"
          >
            <PlusCircle className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            className="rounded-full bg-black/50 hover:bg-black/70"
          >
            <Download className="h-5 w-5 text-white" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
