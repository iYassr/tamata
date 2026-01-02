import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TimerControlsProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ isRunning, onToggle, onReset, onSkip }: TimerControlsProps) {
  const { t } = useLanguage()

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onReset}
              className="h-12 w-12 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('reset')} (R)</p>
          </TooltipContent>
        </Tooltip>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onToggle}
            size="lg"
            className="h-20 w-20 rounded-full shadow-lg shadow-primary/25"
          >
            <motion.div
              key={isRunning ? 'pause' : 'play'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isRunning ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ms-1" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onSkip}
              className="h-12 w-12 rounded-full"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('skip')} (S)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
