"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Volume1, Settings, Play, Pause, Square } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface TTSToggleProps {
  className?: string
}

export function TTSToggle({ className }: TTSToggleProps) {
  const {
    isEnabled,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    rate,
    pitch,
    volume,
    toggleTTS,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    updateVoice,
    updateSpeechParams,
  } = useTextToSpeech()

  const [showSettings, setShowSettings] = useState(false)

  if (!isSupported) {
    return null // Don't show TTS controls if not supported
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {/* Main TTS Toggle Button */}
      <Button
        variant={isEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleTTS}
        className="flex items-center gap-2"
      >
        {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {isEnabled ? "Voice On" : "Voice Off"}
        </span>
      </Button>

      {/* Speech Control Buttons (only show when enabled) */}
      {isEnabled && (
        <>
          {isSpeaking ? (
            <Button
              variant="outline"
              size="sm"
              onClick={pauseSpeaking}
              className="flex items-center gap-1"
            >
              <Pause className="w-3 h-3" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={resumeSpeaking}
              className="flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={stopSpeaking}
            className="flex items-center gap-1"
          >
            <Square className="w-3 h-3" />
          </Button>
        </>
      )}

      {/* Settings Dropdown */}
      <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Voice Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Voice Selection */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Voice
            </label>
            <select
              value={selectedVoice?.name || ""}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value)
                updateVoice(voice || null)
              }}
              className="w-full p-2 text-xs border rounded bg-background"
            >
              <option value="">Default Voice</option>
              {voices
                .filter(voice => voice.lang.startsWith("en"))
                .map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </div>

          <DropdownMenuSeparator />

          {/* Speech Rate */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Speed: {rate.toFixed(1)}x
            </label>
            <Slider
              value={[rate]}
              onValueChange={([value]) => updateSpeechParams({ rate: value })}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Speech Pitch */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Pitch: {pitch.toFixed(1)}
            </label>
            <Slider
              value={[pitch]}
              onValueChange={([value]) => updateSpeechParams({ pitch: value })}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Speech Volume */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Volume: {Math.round(volume * 100)}%
            </label>
            <Slider
              value={[volume]}
              onValueChange={([value]) => updateSpeechParams({ volume: value })}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <DropdownMenuSeparator />
          
          {/* Status */}
          <div className="p-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
                {isEnabled ? (isSpeaking ? "Speaking" : "Ready") : "Disabled"}
              </Badge>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
