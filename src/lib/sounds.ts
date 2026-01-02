import type { Sound, SoundPreset } from '../types'

export const sounds: Sound[] = [
  // Rain
  {
    id: 'rain-light',
    name: 'Light Rain',
    icon: '🌧️',
    category: 'rain',
    src: '/sounds/rain-light.mp3',
    loop: true
  },
  {
    id: 'rain-heavy',
    name: 'Heavy Rain',
    icon: '⛈️',
    category: 'rain',
    src: '/sounds/rain-heavy.mp3',
    loop: true
  },
  {
    id: 'thunder',
    name: 'Thunder',
    icon: '🌩️',
    category: 'rain',
    src: '/sounds/thunder.mp3',
    loop: true
  },
  // Nature
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    category: 'nature',
    src: '/sounds/forest.mp3',
    loop: true
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    icon: '🌊',
    category: 'nature',
    src: '/sounds/ocean.mp3',
    loop: true
  },
  {
    id: 'birds',
    name: 'Birds',
    icon: '🐦',
    category: 'nature',
    src: '/sounds/birds.mp3',
    loop: true
  },
  {
    id: 'fire',
    name: 'Fireplace',
    icon: '🔥',
    category: 'nature',
    src: '/sounds/fire.mp3',
    loop: true
  },
  // Ambient
  {
    id: 'cafe',
    name: 'Coffee Shop',
    icon: '☕',
    category: 'ambient',
    src: '/sounds/cafe.mp3',
    loop: true
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    icon: '🎵',
    category: 'ambient',
    src: '/sounds/lofi.mp3',
    loop: true
  },
  // Noise
  {
    id: 'white-noise',
    name: 'White Noise',
    icon: '📻',
    category: 'noise',
    src: '/sounds/white-noise.mp3',
    loop: true
  },
  {
    id: 'pink-noise',
    name: 'Pink Noise',
    icon: '🎀',
    category: 'noise',
    src: '/sounds/pink-noise.mp3',
    loop: true
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    icon: '🟤',
    category: 'noise',
    src: '/sounds/brown-noise.mp3',
    loop: true
  }
]

export const presets: SoundPreset[] = [
  {
    id: 'rainy-cafe',
    name: 'Rainy Café',
    sounds: {
      'rain-light': 0.6,
      'cafe': 0.4
    }
  },
  {
    id: 'forest-retreat',
    name: 'Forest Retreat',
    sounds: {
      'forest': 0.7,
      'birds': 0.4
    }
  },
  {
    id: 'cozy-fire',
    name: 'Cozy Fire',
    sounds: {
      'fire': 0.6,
      'rain-light': 0.3
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    sounds: {
      'ocean': 0.7
    }
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    sounds: {
      'brown-noise': 0.5
    }
  },
  {
    id: 'lofi-rain',
    name: 'Lo-Fi & Rain',
    sounds: {
      'lofi': 0.5,
      'rain-light': 0.3
    }
  }
]

export function getSoundById(id: string): Sound | undefined {
  return sounds.find(s => s.id === id)
}

export function getSoundsByCategory(category: Sound['category']): Sound[] {
  return sounds.filter(s => s.category === category)
}

export function getPresetById(id: string): SoundPreset | undefined {
  return presets.find(p => p.id === id)
}
