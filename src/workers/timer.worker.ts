let intervalId: number | null = null
let remaining = 0

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  switch (type) {
    case 'start':
      if (payload?.duration !== undefined) {
        remaining = payload.duration
      }
      if (intervalId) {
        clearInterval(intervalId)
      }
      intervalId = setInterval(() => {
        remaining--
        self.postMessage({ type: 'tick', payload: { remaining } })

        if (remaining <= 0) {
          if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
          }
          self.postMessage({ type: 'complete' })
        }
      }, 1000) as unknown as number
      break

    case 'pause':
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      break

    case 'reset':
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      if (payload?.duration !== undefined) {
        remaining = payload.duration
      }
      break

    case 'sync':
      if (payload?.remaining !== undefined) {
        remaining = payload.remaining
      }
      break
  }
}

export {}
