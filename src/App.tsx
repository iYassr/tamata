import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Volume2, Keyboard, X, Timer as TimerIcon } from 'lucide-react'
import { Timer } from './components/timer/Timer'
import { SoundMixer } from './components/ambiance/SoundMixer'
import { Analytics } from './components/analytics/Analytics'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <TimerIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Tamata</h1>
              <p className="text-xs text-zinc-500">Focus Timer</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <NavButton
              active={activePanel === 'sounds'}
              onClick={() => togglePanel('sounds')}
              icon={<Volume2 className="w-5 h-5" />}
              label="Sounds"
            />
            <NavButton
              active={activePanel === 'analytics'}
              onClick={() => togglePanel('analytics')}
              icon={<BarChart3 className="w-5 h-5" />}
              label="Stats"
            />
            <NavButton
              active={showShortcuts}
              onClick={() => setShowShortcuts(!showShortcuts)}
              icon={<Keyboard className="w-5 h-5" />}
              label="Keys"
            />
          </nav>
        </header>

        {/* Timer */}
        <div className="mt-16 lg:mt-0">
          <Timer />
        </div>

        {/* Keyboard shortcuts modal */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowShortcuts(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-2xl border border-zinc-800 p-6 w-full max-w-sm shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
                  <button
                    onClick={() => setShowShortcuts(false)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <ShortcutRow label="Start / Pause" shortcut="Space" />
                  <ShortcutRow label="Reset Timer" shortcut="R" />
                  <ShortcutRow label="Skip Session" shortcut="S" />
                  <ShortcutRow label="Close Modal" shortcut="Esc" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Side panel */}
      <AnimatePresence>
        {activePanel && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setActivePanel(null)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md lg:relative lg:w-96 z-50 lg:z-auto"
            >
              <div className="h-full glass lg:bg-zinc-900/50 border-l border-zinc-800 overflow-y-auto">
                <div className="sticky top-0 z-10 glass lg:bg-transparent border-b border-zinc-800 p-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    {activePanel === 'sounds' ? 'Ambient Sounds' : 'Analytics'}
                  </h2>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors lg:hidden"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                <div className="p-4 lg:p-6">
                  {activePanel === 'sounds' && <SoundMixer />}
                  {activePanel === 'analytics' && <Analytics />}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
        ${active
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
        }
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function ShortcutRow({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <kbd className="px-3 py-1.5 bg-zinc-800 rounded-lg border border-zinc-700 text-xs font-mono text-zinc-300">
        {shortcut}
      </kbd>
    </div>
  )
}
