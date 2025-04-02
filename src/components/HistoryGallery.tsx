'use client'

import { useAppStore } from '@/lib/store'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Download, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

export function HistoryGallery() {
  const { history, removeFromHistory, addToGallery } = useAppStore()

  if (history.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Your generation history will appear here
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
      link.download = `ghibli-art-${safePrompt}-${Date.now()}.jpg`

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

  const handleAddToGallery = (item: typeof history[0]) => {
    addToGallery(item)
    toast.success('Added to gallery')
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {history.map((item) => (
        <Card key={item.id} className="overflow-hidden flex flex-col">
          <CardHeader className="p-3">
            <CardTitle className="text-xs truncate" title={item.prompt}>
              {item.prompt}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative group flex-grow">
            <Image
              src={item.imageUrl}
              alt={item.prompt}
              width={512}
              height={512}
              className="w-full h-auto object-cover aspect-square"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/40 border-white/20 text-white mr-2"
                onClick={() => handleDownload(item.imageUrl, item.prompt)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/40 border-white/20 text-white"
                onClick={() => handleAddToGallery(item)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-3 flex justify-between items-center text-xs text-muted-foreground">
            <div>
              {formatDistanceToNow(item.createdAt, { addSuffix: true })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeFromHistory(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
