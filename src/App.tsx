import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Volume2, Keyboard, X, Timer as TimerIcon } from 'lucide-react'
import { Timer } from '@/components/timer/Timer'
import { SoundMixer } from '@/components/ambiance/SoundMixer'
import { Analytics } from '@/components/analytics/Analytics'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'

type Panel = 'sounds' | 'analytics' | null

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useKeyboardShortcuts()

  const togglePanel = (panel: Panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <TimerIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Tamata</h1>
              <p className="text-xs text-muted-foreground">Focus Timer</p>
            </div>
          </div>

          <ToggleGroup type="single" value={activePanel || ''} className="gap-1">
            <ToggleGroupItem
              value="sounds"
              onClick={() => togglePanel('sounds')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            >
              <Volume2 className="w-5 h-5" />
              <span className="hidden sm:inline">Sounds</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="analytics"
              onClick={() => togglePanel('analytics')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Stats</span>
            </ToggleGroupItem>
            <Button
              variant={showShortcuts ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            >
              <Keyboard className="w-5 h-5" />
              <span className="hidden sm:inline">Keys</span>
            </Button>
          </ToggleGroup>
        </header>

        {/* Timer */}
        <div className="mt-16 lg:mt-0">
          <Timer />
        </div>

        {/* Keyboard shortcuts dialog */}
        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <ShortcutRow label="Start / Pause" shortcut="Space" />
              <ShortcutRow label="Reset Timer" shortcut="R" />
              <ShortcutRow label="Skip Session" shortcut="S" />
              <ShortcutRow label="Close Modal" shortcut="Esc" />
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Side panel - Sheet for mobile, motion.aside for desktop */}
      <Sheet open={activePanel !== null} onOpenChange={(open) => !open && setActivePanel(null)}>
        <SheetContent side="right" className="w-full max-w-md p-0 lg:hidden">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>
              {activePanel === 'sounds' ? 'Ambient Sounds' : 'Analytics'}
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
            {activePanel === 'sounds' && <SoundMixer />}
            {activePanel === 'analytics' && <Analytics />}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop side panel */}
      <AnimatePresence>
        {activePanel && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="hidden lg:block fixed right-0 top-0 bottom-0 w-96 z-50"
          >
            <Card className="h-full rounded-none border-l border-t-0 border-r-0 border-b-0 bg-card/95 backdrop-blur-sm">
              <CardHeader className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm flex flex-row items-center justify-between">
                <CardTitle>
                  {activePanel === 'sounds' ? 'Ambient Sounds' : 'Analytics'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActivePanel(null)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto h-[calc(100vh-60px)]">
                {activePanel === 'sounds' && <SoundMixer />}
                {activePanel === 'analytics' && <Analytics />}
              </CardContent>
            </Card>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShortcutRow({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <kbd className="px-3 py-1.5 bg-secondary rounded-lg border border-border text-xs font-mono">
        {shortcut}
      </kbd>
    </div>
  )
}
