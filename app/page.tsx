import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'LiveDex - Choose Your Game',
  description: 'Select your Pokémon game to start tracking your collection',
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 text-foreground">LiveDex</h1>
          <p className="text-lg text-muted-foreground">
            Track, collect, and perfect your Pokémon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pokémon Legends: Arceus */}
          <Link href="/main?game=arceus" className="group">
            <div className="border border-border rounded-lg p-8 hover:border-primary transition-colors h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Pokémon Legends: Arceus
                </h2>
                <p className="text-muted-foreground mb-4">
                  Track 242 Pokémon from Hisui
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Alpha Pokémon</p>
                  <p>• Shiny Variants</p>
                  <p>• Perfect IVs/EVs</p>
                </div>
              </div>
              <Button className="w-full mt-6 group-hover:bg-primary">
                Start Collecting
              </Button>
            </div>
          </Link>

          {/* Pokémon Z-A */}
          <Link href="/main?game=zeroA" className="group">
            <div className="border border-border rounded-lg p-8 hover:border-primary transition-colors h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Pokémon Z-A
                </h2>
                <p className="text-muted-foreground mb-4">
                  Track 231 new Pokémon from Kalos
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Regional Forms</p>
                  <p>• Mega Evolutions</p>
                  <p>• Complete Dex</p>
                </div>
              </div>
              <Button className="w-full mt-6 group-hover:bg-primary">
                Start Collecting
              </Button>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>Coming soon: Sync across devices</p>
        </div>
      </div>
    </main>
  )
}
