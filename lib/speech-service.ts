// Speech Service - Supports multiple TTS providers
export interface SpeechConfig {
  provider: 'google' | 'azure' | 'elevenlabs' | 'polly' | 'browser'
  apiKey?: string
  region?: string
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
}

export interface SpeechProvider {
  name: string
  speak: (text: string, config: SpeechConfig) => Promise<void>
  getVoices: () => Promise<Array<{ id: string; name: string; language: string }>>
  isSupported: () => boolean
}

// Browser Speech API Provider (fallback)
class BrowserSpeechProvider implements SpeechProvider {
  name = 'Browser Speech'
  
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  async speak(text: string, config: SpeechConfig): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Browser Speech API not supported')
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice
      if (config.voice) {
        const voices = window.speechSynthesis.getVoices()
        const selectedVoice = voices.find(v => v.name === config.voice || v.voiceURI === config.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }
      
      utterance.rate = config.rate || 1
      utterance.pitch = config.pitch || 1
      utterance.volume = config.volume || 1

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`))
      
      window.speechSynthesis.speak(utterance)
    })
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    if (!this.isSupported()) return []
    
    return new Promise((resolve) => {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        resolve(voices.map(voice => ({
          id: voice.voiceURI,
          name: voice.name,
          language: voice.lang
        })))
      }
      
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices()
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    })
  }
}

// Google Cloud Text-to-Speech Provider
class GoogleSpeechProvider implements SpeechProvider {
  name = 'Google Cloud TTS'
  
  isSupported(): boolean {
    return true // Server-side API
  }

  async speak(text: string, config: SpeechConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Google Cloud API key required')
    }

    try {
      const response = await fetch('/api/speech/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          apiKey: config.apiKey,
          voice: config.voice || 'en-US-Wavenet-D',
          rate: config.rate || 1.0,
          pitch: config.pitch || 1.0,
          volume: config.volume || 1.0,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to synthesize speech')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = () => reject(new Error('Failed to play audio'))
        audio.play()
      })
    } catch (error) {
      throw new Error(`Google TTS error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    return [
      { id: 'en-US-Wavenet-A', name: 'Google US English (Male)', language: 'en-US' },
      { id: 'en-US-Wavenet-B', name: 'Google US English (Male)', language: 'en-US' },
      { id: 'en-US-Wavenet-C', name: 'Google US English (Female)', language: 'en-US' },
      { id: 'en-US-Wavenet-D', name: 'Google US English (Male)', language: 'en-US' },
      { id: 'en-US-Wavenet-E', name: 'Google US English (Female)', language: 'en-US' },
      { id: 'en-US-Wavenet-F', name: 'Google US English (Female)', language: 'en-US' },
      { id: 'en-GB-Wavenet-A', name: 'Google UK English (Male)', language: 'en-GB' },
      { id: 'en-GB-Wavenet-B', name: 'Google UK English (Male)', language: 'en-GB' },
      { id: 'en-GB-Wavenet-C', name: 'Google UK English (Female)', language: 'en-GB' },
      { id: 'en-GB-Wavenet-D', name: 'Google UK English (Male)', language: 'en-GB' },
    ]
  }
}

// ElevenLabs Provider (High-quality AI voices)
class ElevenLabsProvider implements SpeechProvider {
  name = 'ElevenLabs'
  
  isSupported(): boolean {
    return true // API-based
  }

  async speak(text: string, config: SpeechConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('ElevenLabs API key required')
    }

    try {
      const response = await fetch('/api/speech/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          apiKey: config.apiKey,
          voiceId: config.voice || '21m00Tcm4TlvDq8ikWAM', // Default voice
          stability: 0.5,
          similarityBoost: 0.5,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to synthesize speech')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = () => reject(new Error('Failed to play audio'))
        audio.play()
      })
    } catch (error) {
      throw new Error(`ElevenLabs TTS error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    return [
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', language: 'en-US' },
      { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', language: 'en-US' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', language: 'en-US' },
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', language: 'en-US' },
      { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', language: 'en-US' },
      { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', language: 'en-US' },
      { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', language: 'en-US' },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', language: 'en-US' },
      { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', language: 'en-US' },
    ]
  }
}

// Azure Cognitive Services Provider
class AzureSpeechProvider implements SpeechProvider {
  name = 'Azure Cognitive Services'
  
  isSupported(): boolean {
    return true // API-based
  }

  async speak(text: string, config: SpeechConfig): Promise<void> {
    if (!config.apiKey || !config.region) {
      throw new Error('Azure API key and region required')
    }

    try {
      const response = await fetch('/api/speech/azure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          apiKey: config.apiKey,
          region: config.region,
          voice: config.voice || 'en-US-AriaNeural',
          rate: config.rate || 1.0,
          pitch: config.pitch || 1.0,
          volume: config.volume || 1.0,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to synthesize speech')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = () => reject(new Error('Failed to play audio'))
        audio.play()
      })
    } catch (error) {
      throw new Error(`Azure TTS error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    return [
      { id: 'en-US-AriaNeural', name: 'Aria (Neural)', language: 'en-US' },
      { id: 'en-US-JennyNeural', name: 'Jenny (Neural)', language: 'en-US' },
      { id: 'en-US-GuyNeural', name: 'Guy (Neural)', language: 'en-US' },
      { id: 'en-US-DavisNeural', name: 'Davis (Neural)', language: 'en-US' },
      { id: 'en-US-AmberNeural', name: 'Amber (Neural)', language: 'en-US' },
      { id: 'en-US-AnaNeural', name: 'Ana (Neural)', language: 'en-US' },
      { id: 'en-US-BrandonNeural', name: 'Brandon (Neural)', language: 'en-US' },
      { id: 'en-US-ChristopherNeural', name: 'Christopher (Neural)', language: 'en-US' },
      { id: 'en-US-CoraNeural', name: 'Cora (Neural)', language: 'en-US' },
      { id: 'en-US-ElizabethNeural', name: 'Elizabeth (Neural)', language: 'en-US' },
    ]
  }
}

// Speech Service Manager
export class SpeechService {
  private providers: Map<string, SpeechProvider> = new Map()
  private currentConfig: SpeechConfig = {
    provider: 'browser',
    rate: 1,
    pitch: 1,
    volume: 1,
  }

  constructor() {
    this.providers.set('browser', new BrowserSpeechProvider())
    this.providers.set('google', new GoogleSpeechProvider())
    this.providers.set('elevenlabs', new ElevenLabsProvider())
    this.providers.set('azure', new AzureSpeechProvider())
  }

  setConfig(config: SpeechConfig): void {
    this.currentConfig = { ...this.currentConfig, ...config }
    
    // Save to localStorage
    localStorage.setItem('speechConfig', JSON.stringify(this.currentConfig))
  }

  getConfig(): SpeechConfig {
    // Load from localStorage
    const saved = localStorage.getItem('speechConfig')
    if (saved) {
      try {
        this.currentConfig = { ...this.currentConfig, ...JSON.parse(saved) }
      } catch (error) {
        console.error('Error loading speech config:', error)
      }
    }
    return this.currentConfig
  }

  async speak(text: string): Promise<void> {
    const provider = this.providers.get(this.currentConfig.provider)
    if (!provider) {
      throw new Error(`Provider ${this.currentConfig.provider} not found`)
    }

    if (!provider.isSupported()) {
      throw new Error(`Provider ${this.currentConfig.provider} not supported`)
    }

    // Clean text for better speech
    const cleanText = this.cleanText(text)
    return provider.speak(cleanText, this.currentConfig)
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    const provider = this.providers.get(this.currentConfig.provider)
    if (!provider) {
      return []
    }

    return provider.getVoices()
  }

  getAvailableProviders(): Array<{ id: string; name: string; supported: boolean }> {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      name: provider.name,
      supported: provider.isSupported(),
    }))
  }

  private cleanText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s.,!?;:-]/g, '') // Remove special characters
      .trim()
  }
}

// Export singleton instance
export const speechService = new SpeechService()
