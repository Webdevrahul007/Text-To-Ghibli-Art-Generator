'use client'

import { useAppStore } from '@/lib/store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export function ModelSelector() {
  const { availableModels, selectedModel, setSelectedModel } = useAppStore()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Model Selection</h3>
      <Tabs
        defaultValue={selectedModel.id}
        value={selectedModel.id}
        onValueChange={setSelectedModel}
        className="w-full"
      >
        <TabsList className="w-full">
          {availableModels.map((model) => (
            <TabsTrigger
              key={model.id}
              value={model.id}
              className="flex-1 relative"
            >
              <span className="truncate">{model.name}</span>
              {model.isPaid && (
                <Badge variant="outline" className="ml-1 text-xs absolute -top-1 -right-1">
                  Paid
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableModels.map((model) => (
          <TabsContent key={model.id} value={model.id} className="space-y-2 mt-2">
            <div className="text-sm">{model.description}</div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Prompt Prefix:</span> {model.promptPrefix}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
