// Audio manager using Howler.js for real sounds + Web Audio API for noise generators
import { Howl } from 'howler'

type NoiseType = 'white' | 'pink' | 'brown'

interface SoundInstance {
  howl?: Howl
  noiseNode?: {
    source: AudioBufferSourceNode
    gain: GainNode
  }
  type: 'howl' | 'noise'
}

// Sound file mappings
const soundFiles: Record<string, string> = {
  'rain-light': '/sounds/rain.mp3',
  'rain-heavy': '/sounds/rain.mp3',
  'thunder': '/sounds/thunder.mp3',
  'forest': '/sounds/forest.mp3',
  'ocean': '/sounds/ocean.mp3',
  'birds': '/sounds/birds.mp3',
  'fire': '/sounds/fire.mp3',
  'cafe': '/sounds/cafe.mp3',
  'lofi': '/sounds/cafe.mp3', // Use cafe as placeholder for lofi
}

class AudioManager {
  private sounds: Map<string, SoundInstance> = new Map()
  private audioCtx: AudioContext | null = null
  private masterGain: GainNode | null = null

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext()
      this.masterGain = this.audioCtx.createGain()
      this.masterGain.connect(this.audioCtx.destination)
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  setMasterVolume(volume: number) {
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(volume, this.audioCtx.currentTime)
    }
  }

  // Create noise buffer for white/pink/brown noise
  private createNoiseBuffer(type: NoiseType, duration: number = 4): AudioBuffer {
    const ctx = this.getAudioContext()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1

        if (type === 'white') {
          data[i] = white * 0.5
        } else if (type === 'pink') {
          // Pink noise using Paul Kellet's refined method
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          b3 = 0.86650 * b3 + white * 0.3104856
          b4 = 0.55000 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.0168980
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
          b6 = white * 0.115926
        } else if (type === 'brown') {
          // Brown noise (random walk)
          b0 = (b0 + (0.02 * white)) / 1.02
          data[i] = b0 * 3.5
        }
      }
    }
    return buffer
  }

  private createNoiseNode(type: NoiseType, volume: number): SoundInstance['noiseNode'] {
    const ctx = this.getAudioContext()
    const buffer = this.createNoiseBuffer(type)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, ctx.currentTime)

    source.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  play(soundId: string, volume: number) {
    // Stop if already playing
    this.stop(soundId)

    // Handle noise generators with Web Audio API
    if (soundId === 'white-noise' || soundId === 'pink-noise' || soundId === 'brown-noise') {
      const noiseType = soundId.replace('-noise', '') as NoiseType
      const noiseNode = this.createNoiseNode(noiseType, volume)
      if (noiseNode) {
        noiseNode.source.start()
        this.sounds.set(soundId, { noiseNode, type: 'noise' })
      }
      return
    }

    // Handle real sounds with Howler
    const soundFile = soundFiles[soundId]
    if (!soundFile) return

    const howl = new Howl({
      src: [soundFile],
      loop: true,
      volume: volume,
      html5: true, // Better for long audio files
      onloaderror: (_id, error) => {
        console.error(`Failed to load sound ${soundId}:`, error)
      }
    })

    howl.play()
    this.sounds.set(soundId, { howl, type: 'howl' })
  }

  setVolume(soundId: string, volume: number) {
    const instance = this.sounds.get(soundId)
    if (!instance) return

    if (instance.type === 'howl' && instance.howl) {
      instance.howl.volume(volume)
    } else if (instance.type === 'noise' && instance.noiseNode && this.audioCtx) {
      instance.noiseNode.gain.gain.setValueAtTime(volume, this.audioCtx.currentTime)
    }
  }

  stop(soundId: string) {
    const instance = this.sounds.get(soundId)
    if (!instance) return

    if (instance.type === 'howl' && instance.howl) {
      instance.howl.fade(instance.howl.volume(), 0, 200)
      setTimeout(() => {
        instance.howl?.stop()
        instance.howl?.unload()
      }, 200)
    } else if (instance.type === 'noise' && instance.noiseNode && this.audioCtx) {
      const { gain, source } = instance.noiseNode
      gain.gain.setValueAtTime(gain.gain.value, this.audioCtx.currentTime)
      gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.2)
      setTimeout(() => {
        try {
          source.stop()
        } catch (e) {
          // Already stopped
        }
      }, 200)
    }

    this.sounds.delete(soundId)
  }

  stopAll() {
    this.sounds.forEach((_, soundId) => this.stop(soundId))
  }

  isPlaying(soundId: string): boolean {
    return this.sounds.has(soundId)
  }
}

export const audioGenerator = new AudioManager()
