import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Volume2, Keyboard, X, Timer as TimerIcon, Globe, Shuffle } from 'lucide-react'
import { Timer } from '@/components/timer/Timer'
import { SoundMixer } from '@/components/ambiance/SoundMixer'
import { Analytics } from '@/components/analytics/Analytics'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAudio } from '@/hooks/useAudio'
import { getRandomSound } from '@/lib/sounds'
import { Button } from '@/components/ui/button'
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const [currentRandomSound, setCurrentRandomSound] = useState<{ id: string; name: string; icon: string } | null>(null)
  const isMobile = useIsMobile()
  const { t, language, setLanguage, isRTL } = useLanguage()
  const { toggle, activeSounds, stopAll } = useAudio()

  useKeyboardShortcuts()

  const handleRandomSound = () => {
    // Stop all current sounds first
    stopAll()
    // Get a random sound and play it
    const randomSound = getRandomSound()
    toggle(randomSound.id)
    setCurrentRandomSound({ id: randomSound.id, name: randomSound.name, icon: randomSound.icon })
  }

  const togglePanel = (panel: Panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isRTL ? 'font-arabic' : ''}`}>
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <TimerIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('appName')}</h1>
              <p className="text-xs text-muted-foreground">{t('appTagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={activePanel || ''} className="gap-1">
              <ToggleGroupItem
                value="sounds"
                onClick={() => togglePanel('sounds')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
              >
                <Volume2 className="w-5 h-5" />
                <span className="hidden sm:inline">{t('sounds')}</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="analytics"
                onClick={() => togglePanel('analytics')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">{t('stats')}</span>
              </ToggleGroupItem>
            </ToggleGroup>

            <Button
              variant={showShortcuts ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            >
              <Keyboard className="w-5 h-5" />
              <span className="hidden sm:inline">{t('keys')}</span>
            </Button>

            <Button
              variant={showLanguage ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowLanguage(!showLanguage)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            >
              <Globe className="w-5 h-5" />
              <span className="hidden sm:inline">{language === 'ar' ? 'ع' : 'EN'}</span>
            </Button>
          </div>
        </header>

        {/* Timer */}
        <div className="mt-16 lg:mt-0">
          <Timer />
        </div>

        {/* Random Sound Button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleRandomSound}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Shuffle className="w-5 h-5" />
            <span>{t('randomSound')}</span>
            {currentRandomSound && activeSounds[currentRandomSound.id] && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-primary"
              >
                <span>{currentRandomSound.icon}</span>
              </motion.span>
            )}
          </Button>
        </motion.div>

        {/* Keyboard shortcuts dialog */}
        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('keyboardShortcuts')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <ShortcutRow label={t('startPause')} shortcut="Space" />
              <ShortcutRow label={t('resetTimer')} shortcut="R" />
              <ShortcutRow label={t('skipSession')} shortcut="S" />
              <ShortcutRow label={t('closeModal')} shortcut="Esc" />
            </div>
          </DialogContent>
        </Dialog>

        {/* Language dialog */}
        <Dialog open={showLanguage} onOpenChange={setShowLanguage}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('language')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 pt-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => {
                  setLanguage('en')
                  setShowLanguage(false)
                }}
              >
                🇺🇸 {t('english')}
              </Button>
              <Button
                variant={language === 'ar' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => {
                  setLanguage('ar')
                  setShowLanguage(false)
                }}
              >
                🇸🇦 {t('arabic')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Mobile Sheet - only render on mobile */}
      {isMobile && (
        <Sheet open={activePanel !== null} onOpenChange={(open) => !open && setActivePanel(null)}>
          <SheetContent side={isRTL ? 'left' : 'right'} className="w-full max-w-md p-0">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle>
                {activePanel === 'sounds' ? t('ambientSounds') : t('analytics')}
              </SheetTitle>
            </SheetHeader>
            <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
              {activePanel === 'sounds' && <SoundMixer />}
              {activePanel === 'analytics' && <Analytics />}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop side panel - only render on desktop */}
      {!isMobile && (
        <AnimatePresence>
          {activePanel && (
            <motion.aside
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-96 z-50`}
            >
              <div className={`h-full ${isRTL ? 'border-r' : 'border-l'} border-border bg-card/95 backdrop-blur-sm flex flex-col`}>
                <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between p-4">
                  <h2 className="font-semibold">
                    {activePanel === 'sounds' ? t('ambientSounds') : t('analytics')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActivePanel(null)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  {activePanel === 'sounds' && <SoundMixer />}
                  {activePanel === 'analytics' && <Analytics />}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}
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
