import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Info } from 'lucide-react'

export function Header() {
  return (
    <header className="container mx-auto py-6 text-center">
      <div className="flex items-center justify-center space-x-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ghibli Art Generator
        </h1>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex h-6 w-6 items-center justify-center rounded-full">
              <Info className="h-4 w-4" />
              <span className="sr-only">About</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">About Ghibli Art Generator</h4>
                <p className="text-sm">
                  This tool uses AI to transform your text descriptions into beautiful artwork
                  inspired by the iconic Studio Ghibli style. Create magical landscapes,
                  whimsical characters, and fantastical scenes.
                </p>
                <div className="flex items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Powered by the free & open-source Ghibli-Diffusion model • Made with ❤️
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">
        Transform your ideas into magical artwork
      </p>
    </header>
  )
}
