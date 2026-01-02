import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote as QuoteIcon, RefreshCw } from 'lucide-react'
import { getDailyQuote, getRandomQuote, type Quote } from '@/lib/quotes'
import { Button } from '@/components/ui/button'

export function QuoteDisplay() {
  const [quote, setQuote] = useState<Quote>(getDailyQuote)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setQuote(getRandomQuote())
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-md mx-auto text-center px-4"
    >
      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2 justify-center mb-2">
              <QuoteIcon className="w-4 h-4 text-primary/50 flex-shrink-0 mt-1" />
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {quote.text}
              </p>
            </div>
            <p className="text-xs text-muted-foreground/70">
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </motion.div>
  )
}
