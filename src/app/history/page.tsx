'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HistoryGallery } from '@/components/HistoryGallery'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { useAppStore } from '@/lib/store'

export default function HistoryPage() {
  const { clearHistory, history } = useAppStore()

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
      <Header />
      <main className="container mx-auto flex-1 py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-4">Generation History</h1>
          </div>

          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm('Are you sure you want to clear your history?')) {
                  clearHistory()
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <p className="text-muted-foreground">
            View your previously generated Ghibli-style artworks
          </p>

          <HistoryGallery />
        </div>
      </main>
      <Footer />
    </div>
  )
}
