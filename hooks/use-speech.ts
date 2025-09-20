"use client"

import { useState, useEffect, useCallback } from "react"
import { speechService, SpeechConfig } from "@/lib/speech-service"

export function useSpeech() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voices, setVoices] = useState<Array<{ id: string; name: string; language: string }>>([])
  const [availableProviders, setAvailableProviders] = useState<Array<{ id: string; name: string; supported: boolean }>>([])
  const [config, setConfig] = useState<SpeechConfig>({
    provider: 'browser',
    rate: 1,
    pitch: 1,
    volume: 1,
  })
  const [error, setError] = useState<string | null>(null)

  // Load configuration and initialize
  useEffect(() => {
    const savedConfig = speechService.getConfig()
    setConfig(savedConfig)
    
    // Load available providers
    const providers = speechService.getAvailableProviders()
    setAvailableProviders(providers)
    
    // Load voices for current provider
    loadVoices()
    
    // Load saved enabled state
    const savedEnabled = localStorage.getItem('speechEnabled')
    if (savedEnabled) {
      setIsEnabled(JSON.parse(savedEnabled))
    }
  }, [])

  // Load voices when provider changes
  useEffect(() => {
    loadVoices()
  }, [config.provider])

  const loadVoices = useCallback(async () => {
    try {
      const availableVoices = await speechService.getVoices()
      setVoices(availableVoices)
    } catch (error) {
      console.error('Error loading voices:', error)
      setError('Failed to load voices')
    }
  }, [config.provider])

  const updateConfig = useCallback((newConfig: Partial<SpeechConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    speechService.setConfig(updatedConfig)
  }, [config])

  const toggleEnabled = useCallback(() => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    localStorage.setItem('speechEnabled', JSON.stringify(newEnabled))
    
    // Stop speaking if disabling
    if (!newEnabled && isSpeaking) {
      stopSpeaking()
    }
  }, [isEnabled, isSpeaking])

  const speak = useCallback(async (text: string) => {
    if (!isEnabled || !text.trim()) {
      return
    }

    setIsLoading(true)
    setIsSpeaking(true)
    setError(null)

    try {
      await speechService.speak(text)
    } catch (error) {
      console.error('Speech error:', error)
      setError(error instanceof Error ? error.message : 'Speech synthesis failed')
    } finally {
      setIsLoading(false)
      setIsSpeaking(false)
    }
  }, [isEnabled])

  const stopSpeaking = useCallback(() => {
    // For browser speech API
    if (config.provider === 'browser' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    // For other providers, we can't stop them mid-stream
    setIsSpeaking(false)
    setIsLoading(false)
  }, [config.provider])

  const pauseSpeaking = useCallback(() => {
    // Only works with browser speech API
    if (config.provider === 'browser' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause()
      setIsSpeaking(false)
    }
  }, [config.provider])

  const resumeSpeaking = useCallback(() => {
    // Only works with browser speech API
    if (config.provider === 'browser' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume()
      setIsSpeaking(true)
    }
  }, [config.provider])

  const testSpeech = useCallback(async () => {
    const testText = "Hello! This is a test of the text-to-speech system. How does it sound?"
    await speak(testText)
  }, [speak])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    isEnabled,
    isSpeaking,
    isLoading,
    voices,
    availableProviders,
    config,
    error,
    
    // Actions
    toggleEnabled,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    updateConfig,
    loadVoices,
    testSpeech,
    clearError,
  }
}
