import type { Sound, SoundPreset } from '../types'

export const sounds: Sound[] = [
  // Rain
  { id: 'rain-light', name: 'Light Rain', icon: '🌧️', category: 'rain' },
  { id: 'rain-heavy', name: 'Heavy Rain', icon: '⛈️', category: 'rain' },
  { id: 'thunder', name: 'Thunder', icon: '🌩️', category: 'rain' },
  // Nature
  { id: 'forest', name: 'Forest', icon: '🌲', category: 'nature' },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊', category: 'nature' },
  { id: 'birds', name: 'Birds', icon: '🐦', category: 'nature' },
  { id: 'fire', name: 'Fireplace', icon: '🔥', category: 'nature' },
  { id: 'wind', name: 'Wind', icon: '💨', category: 'nature' },
  // Ambient
  { id: 'cafe', name: 'Coffee Shop', icon: '☕', category: 'ambient' },
  { id: 'library', name: 'Library', icon: '📚', category: 'ambient' },
  { id: 'train', name: 'Train', icon: '🚂', category: 'ambient' },
  { id: 'typing', name: 'Typing', icon: '⌨️', category: 'ambient' },
  // Noise
  { id: 'white-noise', name: 'White Noise', icon: '📻', category: 'noise' },
  { id: 'pink-noise', name: 'Pink Noise', icon: '🎀', category: 'noise' },
  { id: 'brown-noise', name: 'Brown Noise', icon: '🟤', category: 'noise' }
]

export const presets: SoundPreset[] = [
  {
    id: 'rainy-cafe',
    name: 'Rainy Café',
    sounds: { 'rain-light': 0.6, 'cafe': 0.4 }
  },
  {
    id: 'forest-retreat',
    name: 'Forest Retreat',
    sounds: { 'forest': 0.7, 'birds': 0.4 }
  },
  {
    id: 'cozy-fire',
    name: 'Cozy Fire',
    sounds: { 'fire': 0.6, 'rain-light': 0.3 }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    sounds: { 'ocean': 0.7 }
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    sounds: { 'brown-noise': 0.5 }
  },
  {
    id: 'train-journey',
    name: 'Train Journey',
    sounds: { 'train': 0.6, 'rain-light': 0.3 }
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

export function getRandomSound(): Sound {
  const randomIndex = Math.floor(Math.random() * sounds.length)
  return sounds[randomIndex]
}
