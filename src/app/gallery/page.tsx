'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { UserGallery } from '@/components/UserGallery'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Toaster } from 'sonner'

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
      <Header />
      <main className="container mx-auto flex-1 py-6 px-4">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Community Gallery</h1>
        </div>

        <div className="space-y-6">
          <p className="text-muted-foreground">
            View and explore your saved Ghibli-style artworks
          </p>

          <UserGallery />
        </div>
      </main>
      <Footer />
    </div>
  )
}
