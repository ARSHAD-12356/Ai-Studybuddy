"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface TextToSpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice
}

export function useTextToSpeech() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.current = window.speechSynthesis
      
      // Load available voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.current?.getVoices() || []
        setVoices(availableVoices)
        
        // Try to find a natural-sounding English voice
        const preferredVoice = availableVoices.find(voice => 
          voice.lang.startsWith("en") && 
          (voice.name.includes("Natural") || voice.name.includes("Enhanced") || voice.name.includes("Premium"))
        ) || availableVoices.find(voice => voice.lang.startsWith("en")) || availableVoices[0]
        
        setSelectedVoice(preferredVoice || null)
      }

      // Load voices immediately
      loadVoices()

      // Some browsers load voices asynchronously
      speechSynthesis.current.onvoiceschanged = loadVoices

      return () => {
        if (speechSynthesis.current) {
          speechSynthesis.current.onvoiceschanged = null
        }
      }
    }
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("textToSpeechSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setIsEnabled(settings.enabled || false)
        setRate(settings.rate || 1)
        setPitch(settings.pitch || 1)
        setVolume(settings.volume || 1)
      } catch (error) {
        console.error("Error loading TTS settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    const settings = {
      enabled: isEnabled,
      rate,
      pitch,
      volume,
    }
    localStorage.setItem("textToSpeechSettings", JSON.stringify(settings))
  }, [isEnabled, rate, pitch, volume])

  // Toggle TTS on/off
  const toggleTTS = useCallback(() => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    
    // If disabling, stop current speech
    if (!newEnabled && isSpeaking) {
      stopSpeaking()
    }
    
    saveSettings()
  }, [isEnabled, isSpeaking])

  // Speak text
  const speak = useCallback((text: string, options?: TextToSpeechOptions) => {
    if (!isEnabled || !speechSynthesis.current || !text.trim()) {
      return
    }

    // Stop any current speech
    stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set voice
    utterance.voice = options?.voice || selectedVoice
    utterance.rate = options?.rate ?? rate
    utterance.pitch = options?.pitch ?? pitch
    utterance.volume = options?.volume ?? volume

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtterance.current = null
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      setIsSpeaking(false)
      currentUtterance.current = null
    }

    utterance.onpause = () => {
      setIsSpeaking(false)
    }

    utterance.onresume = () => {
      setIsSpeaking(true)
    }

    currentUtterance.current = utterance
    speechSynthesis.current.speak(utterance)
  }, [isEnabled, selectedVoice, rate, pitch, volume])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel()
      setIsSpeaking(false)
      currentUtterance.current = null
    }
  }, [])

  // Pause speaking
  const pauseSpeaking = useCallback(() => {
    if (speechSynthesis.current && isSpeaking) {
      speechSynthesis.current.pause()
    }
  }, [isSpeaking])

  // Resume speaking
  const resumeSpeaking = useCallback(() => {
    if (speechSynthesis.current && !isSpeaking && currentUtterance.current) {
      speechSynthesis.current.resume()
    }
  }, [isSpeaking])

  // Update voice
  const updateVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setSelectedVoice(voice)
    saveSettings()
  }, [saveSettings])

  // Update speech parameters
  const updateSpeechParams = useCallback((params: Partial<Pick<TextToSpeechOptions, 'rate' | 'pitch' | 'volume'>>) => {
    if (params.rate !== undefined) setRate(params.rate)
    if (params.pitch !== undefined) setPitch(params.pitch)
    if (params.volume !== undefined) setVolume(params.volume)
    saveSettings()
  }, [saveSettings])

  // Check if TTS is supported
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window

  return {
    // State
    isEnabled,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    rate,
    pitch,
    volume,
    
    // Actions
    toggleTTS,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    updateVoice,
    updateSpeechParams,
  }
}
