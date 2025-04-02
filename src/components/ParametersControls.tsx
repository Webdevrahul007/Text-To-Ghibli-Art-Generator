'use client'

import { useState } from 'react'
import { useAppStore, defaultParameters } from '@/lib/store'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function ParametersControls() {
  const { parameters, updateParameters } = useAppStore()

  const handleStepsChange = (value: number[]) => {
    updateParameters({ steps: value[0] })
  }

  const handleGuidanceChange = (value: number[]) => {
    updateParameters({ guidanceScale: value[0] })
  }

  const handleResetToDefaults = () => {
    updateParameters(defaultParameters)
  }

  const handleDimensionsChange = (size: string) => {
    const [width, height] = size.split('x').map(Number)
    updateParameters({ width, height })
  }

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParameters({ negativePrompt: e.target.value })
  }

  // This gives a string representation of the current size
  const currentSize = `${parameters.width}x${parameters.height}`

  return (
    <div className="space-y-4 p-1">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Generation Parameters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetToDefaults}
          className="h-8 gap-1 text-xs"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="steps">Inference Steps: {parameters.steps}</Label>
          </div>
          <Slider
            id="steps"
            min={20}
            max={50}
            step={1}
            value={[parameters.steps]}
            onValueChange={handleStepsChange}
          />
          <div className="text-xs text-muted-foreground">
            Higher values = better quality but slower generation
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="guidance">Guidance Scale: {parameters.guidanceScale}</Label>
          </div>
          <Slider
            id="guidance"
            min={5}
            max={15}
            step={0.1}
            value={[parameters.guidanceScale]}
            onValueChange={handleGuidanceChange}
          />
          <div className="text-xs text-muted-foreground">
            Higher values = stronger adherence to prompt
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Image Size</Label>
          <Select
            value={currentSize}
            onValueChange={handleDimensionsChange}
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="512x512">512 × 512 (Square)</SelectItem>
              <SelectItem value="640x384">640 × 384 (Landscape 5:3)</SelectItem>
              <SelectItem value="384x640">384 × 640 (Portrait 3:5)</SelectItem>
              <SelectItem value="768x512">768 × 512 (Landscape 3:2)</SelectItem>
              <SelectItem value="512x768">512 × 768 (Portrait 2:3)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="negative-prompt">Negative Prompt</Label>
          <Input
            id="negative-prompt"
            value={parameters.negativePrompt}
            onChange={handleNegativePromptChange}
            placeholder="What to exclude from the image"
          />
          <div className="text-xs text-muted-foreground">
            Words/concepts to avoid in generation
          </div>
        </div>
      </div>
    </div>
  )
}
