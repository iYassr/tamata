// Procedural audio generation using Web Audio API
// No external files needed - all sounds generated in real-time

type NoiseType = 'white' | 'pink' | 'brown'

interface AudioNode {
  source: AudioBufferSourceNode | OscillatorNode
  gain: GainNode
  isPlaying: boolean
}

class AudioGenerator {
  private ctx: AudioContext | null = null
  private nodes: Map<string, AudioNode> = new Map()
  private masterGain: GainNode | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.ctx?.currentTime || 0)
    }
  }

  // Generate noise buffer
  private createNoiseBuffer(type: NoiseType, duration: number = 2): AudioBuffer {
    const ctx = this.getContext()
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

  // Rain sound - filtered noise with modulation
  private createRain(intensity: 'light' | 'heavy'): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('white', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Highpass filter for rain texture
    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = intensity === 'light' ? 4000 : 2000

    // Lowpass for warmth
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = intensity === 'light' ? 8000 : 12000

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Thunder - low frequency rumble
  private createThunder(): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('brown', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 200

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(lowpass)
    lowpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Forest - layered filtered noise
  private createForest(): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('pink', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = 2000
    bandpass.Q.value = 0.5

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(bandpass)
    bandpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Ocean waves - modulated noise
  private createOcean(): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('brown', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 500

    // LFO for wave motion
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.1 // Slow wave motion
    lfoGain.gain.value = 200
    lfo.connect(lfoGain)
    lfoGain.connect(lowpass.frequency)
    lfo.start()

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(lowpass)
    lowpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Birds - chirpy filtered noise
  private createBirds(): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('white', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 3000

    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = 5000
    bandpass.Q.value = 2

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(highpass)
    highpass.connect(bandpass)
    bandpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Fire crackling
  private createFire(): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('brown', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 1000

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 100

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(lowpass)
    lowpass.connect(highpass)
    highpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Cafe ambiance
  private createCafe(): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer('pink', 4)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 3000

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 200

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(lowpass)
    lowpass.connect(highpass)
    highpass.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  // Lo-fi beats - simple drum pattern with filters
  private createLofi(): { source: OscillatorNode; gain: GainNode } {
    const ctx = this.getContext()

    // Create a warm, muffled oscillator
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 60 // Low bass

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 400

    // Add some harmonics
    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.value = 120

    const mixer = ctx.createGain()
    mixer.gain.value = 0.5

    const gain = ctx.createGain()
    gain.gain.value = 0

    osc.connect(lowpass)
    osc2.connect(lowpass)
    lowpass.connect(mixer)
    mixer.connect(gain)
    gain.connect(this.masterGain!)

    osc2.start()

    return { source: osc, gain }
  }

  // Pure noise generators
  private createNoise(type: NoiseType): { source: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getContext()
    const buffer = this.createNoiseBuffer(type, 2)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const gain = ctx.createGain()
    gain.gain.value = 0

    source.connect(gain)
    gain.connect(this.masterGain!)

    return { source, gain }
  }

  play(soundId: string, volume: number) {
    // Stop if already playing
    this.stop(soundId)

    let node: { source: AudioBufferSourceNode | OscillatorNode; gain: GainNode }

    switch (soundId) {
      case 'rain-light':
        node = this.createRain('light')
        break
      case 'rain-heavy':
        node = this.createRain('heavy')
        break
      case 'thunder':
        node = this.createThunder()
        break
      case 'forest':
        node = this.createForest()
        break
      case 'ocean':
        node = this.createOcean()
        break
      case 'birds':
        node = this.createBirds()
        break
      case 'fire':
        node = this.createFire()
        break
      case 'cafe':
        node = this.createCafe()
        break
      case 'lofi':
        node = this.createLofi()
        break
      case 'white-noise':
        node = this.createNoise('white')
        break
      case 'pink-noise':
        node = this.createNoise('pink')
        break
      case 'brown-noise':
        node = this.createNoise('brown')
        break
      default:
        return
    }

    node.gain.gain.setValueAtTime(volume, this.ctx!.currentTime)
    node.source.start()

    this.nodes.set(soundId, {
      source: node.source,
      gain: node.gain,
      isPlaying: true
    })
  }

  setVolume(soundId: string, volume: number) {
    const node = this.nodes.get(soundId)
    if (node && this.ctx) {
      node.gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    }
  }

  stop(soundId: string) {
    const node = this.nodes.get(soundId)
    if (node) {
      try {
        // Fade out
        if (this.ctx) {
          node.gain.gain.setValueAtTime(node.gain.gain.value, this.ctx.currentTime)
          node.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1)
        }
        setTimeout(() => {
          try {
            node.source.stop()
          } catch (e) {
            // Already stopped
          }
        }, 100)
      } catch (e) {
        // Already stopped
      }
      this.nodes.delete(soundId)
    }
  }

  stopAll() {
    this.nodes.forEach((_, soundId) => this.stop(soundId))
  }
}

export const audioGenerator = new AudioGenerator()
