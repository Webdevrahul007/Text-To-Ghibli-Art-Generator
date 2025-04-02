'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PromptForm } from '@/components/PromptForm'
import { ImageDisplay } from '@/components/ImageDisplay'
import { ParametersControls } from '@/components/ParametersControls'
import { ModelSelector } from '@/components/ModelSelector'
import { HistoryGallery } from '@/components/HistoryGallery'
import { UserGallery } from '@/components/UserGallery'
import { ModelComparison } from '@/components/ModelComparison'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Settings, History, Grid3X3, Split } from 'lucide-react'
import { Toaster } from 'sonner'

export default function Home() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('generate')

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl)
  }

  const handlePromptSelect = (prompt: string) => {
    // Find the textarea element in the form and set its value
    const textarea = formRef.current?.querySelector('textarea')
    if (textarea) {
      textarea.value = prompt

      // Focus the textarea to make it clear to the user that the prompt was inserted
      textarea.focus()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
      <Header />
      <main className="container mx-auto flex-1 py-6 px-4">
        <Tabs
          defaultValue="generate"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
        <div className='mx-auto max-w-4xl space-y-8'>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="generate" className="flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" />
                <span className="sm:inline">Generate</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                <span className="sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" />
                <span className="sm:inline">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-1">
                <Split className="h-4 w-4" />
                <span className="sm:inline">Compare</span>
              </TabsTrigger>
            </TabsList>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-6 pt-6">
                  <ModelSelector />
                  <ParametersControls />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

          <TabsContent value="generate" className="w-full">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div ref={formRef}>
                    <PromptForm onImageGenerated={handleImageGenerated} />
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Enter a detailed description of the scene you want to create</p>
                  </div>
                </div>
                <div>
                  <ImageDisplay imageUrl={generatedImageUrl} />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Tips for Great Results</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>Always include "ghibli style"</strong> at the beginning of your prompt for best results</li>
                  <li>Be specific about the scene, characters, and environment</li>
                  <li>Mention details like time of day, weather, and lighting</li>
                  <li>Describe the mood and atmosphere you want to convey</li>
                  <li>Adjust parameters in Settings to fine-tune your results</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Generation History</h2>
              </div>
              <HistoryGallery />
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">User Gallery</h2>
              <p className="text-sm text-muted-foreground">Add your favorite images from history</p>
            </div>
            <UserGallery />
            </div>
          </TabsContent>
          <div className="mx-auto max-w-4xl space-y-8">
          <TabsContent value="compare">
            <ModelComparison />
          </TabsContent>
          </div>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
