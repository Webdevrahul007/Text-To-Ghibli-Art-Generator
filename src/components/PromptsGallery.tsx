'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PromptsGalleryProps {
  onPromptSelect: (prompt: string) => void
}

const examplePrompts = [
  {
    id: 'floating-castle',
    title: 'Floating Castle',
    description: 'A magical castle floating among clouds, with flying creatures and airships',
    prompt: 'ghibli style magical castle floating among clouds, with flying creatures and airships around it, sunbeams breaking through clouds, detailed architecture, pastel colors',
  },
  {
    id: 'forest-spirit',
    title: 'Forest Spirit',
    description: 'A mystical forest spirit with glowing features, surrounded by small forest creatures',
    prompt: 'ghibli style mystical forest spirit with glowing features in a dense magical forest, surrounded by small woodland creatures and floating luminescent particles, shafts of light through trees',
  },
  {
    id: 'seaside-village',
    title: 'Seaside Village',
    description: 'A peaceful coastal village with colorful houses by the sea',
    prompt: 'ghibli style peaceful coastal village with colorful houses perched on cliffs overlooking a serene blue ocean, fishing boats, laundry hanging between buildings, afternoon golden light',
  },
  {
    id: 'cat-cafe',
    title: 'Cat Cafe',
    description: 'A cozy cat cafe with magical cat creatures enjoying tea and cakes',
    prompt: 'ghibli style cozy cat cafe with magical cat creatures serving and enjoying tea and cakes, warm interior with wooden furniture, plants hanging from ceiling, soft lighting through windows',
  },
]

export function PromptsGallery({ onPromptSelect }: PromptsGalleryProps) {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold tracking-tight text-center mb-6">Example Prompts</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {examplePrompts.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onPromptSelect(item.prompt)}
                    >
                      Use Prompt
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Click to use this example prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
