'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type FormValues, formSchema } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface PromptFormProps {
  onImageGenerated: (imageUrl: string) => void
}

export function PromptForm({ onImageGenerated }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { parameters, selectedModel, addToHistory } = useAppStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: data.prompt,
          model: selectedModel,
          parameters,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate image')
      }

      if (result.output && Array.isArray(result.output) && result.output.length > 0) {
        const imageUrl = result.output[0]
        onImageGenerated(imageUrl)

        // Add to history
        addToHistory({
          prompt: data.prompt,
          imageUrl,
          model: selectedModel.name,
          parameters: { ...parameters },
        })

        toast.success('Image generated successfully!')
      } else {
        throw new Error('No image was generated')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate image')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Describe the Ghibli-style scene you want to create... (start with "${selectedModel.promptPrefix}")`}
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be descriptive for best results. Include details about scenery, characters, mood, and lighting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Ghibli Art'
          )}
        </Button>
      </form>
    </Form>
  )
}
