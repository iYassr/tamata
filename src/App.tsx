import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Volume2, Keyboard } from 'lucide-react'
import { Timer } from './components/timer/Timer'
import { SoundMixer } from './components/ambiance/SoundMixer'
import { Analytics } from './components/analytics/Analytics'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { Button } from './components/ui/Button'
import { cn } from './lib/utils'

type Panel = 'sounds' | 'analytics' | null

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useKeyboardShortcuts()

  const togglePanel = (panel: Panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <h1 className="text-2xl font-bold tracking-tight">Tamata</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePanel('sounds')}
                className={cn(activePanel === 'sounds' && 'bg-card')}
                title="Ambient Sounds"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePanel('analytics')}
                className={cn(activePanel === 'analytics' && 'bg-card')}
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShortcuts(!showShortcuts)}
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Timer */}
          <Timer />

          {/* Keyboard shortcuts help */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-4 bg-card rounded-lg border border-border"
              >
                <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start / Pause</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border border-border">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reset</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border border-border">R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skip</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border border-border">S</kbd>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Side panel */}
      <AnimatePresence>
        {activePanel && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="border-l border-border bg-background overflow-hidden"
          >
            <div className="w-[380px] h-full overflow-y-auto p-6">
              {activePanel === 'sounds' && <SoundMixer />}
              {activePanel === 'analytics' && <Analytics />}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
