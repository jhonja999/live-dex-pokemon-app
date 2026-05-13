import Link from 'next/link'

export const metadata = {
  title: 'LiveDex - Choose Your Game',
  description: 'Select your Pokémon game to start tracking your collection',
}

function ArceusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="#8b5e34" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20" strokeWidth="1" opacity="0.4" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="#8b5e34" />
    </svg>
  )
}

function ZeroAIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="#00f2ff" strokeWidth="1.5">
      <path d="M4 4l16 16M20 4L4 20" />
      <circle cx="12" cy="12" r="8" strokeWidth="1" opacity="0.4" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-serif text-[#8b5e34] text-4xl tracking-tight">LiveDex</span>
            <span className="text-muted-foreground/30 text-4xl font-thin">|</span>
            <span className="font-mono text-[#00f2ff] text-3xl tracking-[0.15em] uppercase">v0.1</span>
          </div>
          <p className="text-muted-foreground/70 text-sm tracking-wide">
            Track, collect, and perfect your Pokémon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pokémon Legends: Arceus */}
          <Link href="/main?game=arceus" className="group">
            <div className="relative bg-[#f4e4bc] border-2 border-[#8b5e34]/60 rounded-sm p-8 h-full flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-[8px_8px_0px_#4a3728] overflow-hidden">
              {/* Texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/textures/paper-grain.png")', backgroundSize: '200px' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ArceusIcon />
                  <div>
                    <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8b5e34]/60">Hisui Region</p>
                    <h2 className="text-xl font-serif font-bold text-[#4a3728] leading-tight">
                      Pokémon Legends:<br />Arceus
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-[#8b5e34]/80 font-serif mb-6">
                  Track 242 Pokémon from Hisui
                </p>

                <div className="space-y-2 text-xs text-[#4a3728]/70 font-serif">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#8b5e34]/40 flex-shrink-0" />
                    Alpha Pokémon variants
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#8b5e34]/40 flex-shrink-0" />
                    Shiny hunting tracker
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#8b5e34]/40 flex-shrink-0" />
                    Perfect IV/EV registry
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 w-full py-2.5 bg-[#8b5e34] text-[#f4ebd0] text-xs font-serif uppercase tracking-[0.15em] text-center transition-all group-hover:bg-[#4a3728]">
                Enter Hisui
              </div>
            </div>
          </Link>

          {/* Pokémon Z-A */}
          <Link href="/main?game=zeroA" className="group">
            <div className="relative bg-[#05161a] border border-[#00f2ff]/40 rounded-none p-8 h-full flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,242,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ZeroAIcon />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00f2ff]/50">Lumiose City</p>
                    <h2 className="text-xl font-mono font-black text-[#00f2ff] leading-tight tracking-[-0.02em]">
                      Pokémon<br />Z-A
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-[#00f2ff]/70 font-mono mb-6">
                  Track 231 Pokémon from Kalos
                </p>

                <div className="space-y-2 text-xs text-[#00f2ff]/60 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00f2ff]/40">{'>'}</span>
                    Regional Form registry
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00f2ff]/40">{'>'}</span>
                    Mega Evolution tracker
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00f2ff]/40">{'>'}</span>
                    Complete Dex completion
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 w-full py-2.5 bg-[#00f2ff] text-[#05161a] text-xs font-mono font-black italic uppercase text-center transition-all group-hover:shadow-[0_0_20px_#00f2ff]">
                Initialize System
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground/40 text-xs font-mono tracking-[0.2em] uppercase">
            Sync across devices · Coming soon
          </p>
        </div>
      </div>
    </main>
  )
}
