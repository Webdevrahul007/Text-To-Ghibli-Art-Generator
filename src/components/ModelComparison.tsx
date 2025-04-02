'use client'

import { useState } from 'react'
import { useAppStore, availableModels } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ModelResult {
  modelId: string;
  modelName: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function ModelComparison() {
  const { parameters } = useAppStore()
  const [prompt, setPrompt] = useState('')
  const [results, setResults] = useState<ModelResult[]>(
    availableModels.map(model => ({
      modelId: model.id,
      modelName: model.name,
      imageUrl: null,
      isLoading: false,
      error: null
    }))
  )

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const generateAllImages = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    // Reset all results first
    setResults(prev =>
      prev.map(result => ({
        ...result,
        isLoading: true,
        error: null
      }))
    )

    // Generate images for each model in parallel
    const generatePromises = availableModels.map(async (model, index) => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            model,
            parameters,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Failed to generate with ${model.name}`)
        }

        return {
          index,
          imageUrl: data.output[0],
          error: null
        }
      } catch (error) {
        console.error(`Error with ${model.name}:`, error)
        return {
          index,
          imageUrl: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    // Process results as they complete
    const results = await Promise.allSettled(generatePromises)

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        const { index, imageUrl, error } = result.value
        setResults(prev => {
          const newResults = [...prev]
          newResults[index] = {
            ...newResults[index],
            imageUrl,
            error,
            isLoading: false
          }
          return newResults
        })
      } else {
        setResults(prev => {
          const newResults = [...prev]
          newResults[i] = {
            ...newResults[i],
            error: 'Failed to generate',
            isLoading: false
          }
          return newResults
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Model Comparison</h2>
        <p className="text-sm text-muted-foreground">
          Compare how different Ghibli-style models interpret the same prompt
        </p>

        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Enter a prompt to compare across models..."
            className="min-h-[100px]"
          />

          <Button
            onClick={generateAllImages}
            disabled={results.some(r => r.isLoading)}
            className="w-full"
          >
            {results.some(r => r.isLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Compare All Models'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((result) => (
          <div key={result.modelId} className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/30 border-b">
              <h3 className="font-medium">{result.modelName}</h3>
            </div>
            <div className="p-0 aspect-square relative">
              {result.isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : result.error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 p-4">
                  <p className="text-destructive text-sm text-center">
                    {result.error}
                  </p>
                </div>
              ) : result.imageUrl ? (
                <Image
                  src={result.imageUrl}
                  alt={`${result.modelName} result for "${prompt}"`}
                  width={512}
                  height={512}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground text-sm">
                    Enter a prompt and click "Compare All Models"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
