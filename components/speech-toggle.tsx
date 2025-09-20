"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  Key,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"
import { SpeechConfig } from "@/lib/speech-service"
import { SpeechSetupGuide } from "@/components/speech-setup-guide"

interface SpeechToggleProps {
  className?: string
}

export function SpeechToggle({ className }: SpeechToggleProps) {
  const {
    isEnabled,
    isSpeaking,
    isLoading,
    voices,
    availableProviders,
    config,
    error,
    toggleEnabled,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    updateConfig,
    testSpeech,
    clearError,
  } = useSpeech()

  const [showSettings, setShowSettings] = useState(false)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [tempApiKey, setTempApiKey] = useState("")
  const [tempRegion, setTempRegion] = useState("")

  const handleProviderChange = (providerId: string) => {
    updateConfig({ provider: providerId as SpeechConfig['provider'] })
    
    // Show API key dialog for non-browser providers
    if (providerId !== 'browser') {
      setShowApiKeyDialog(true)
      setTempApiKey("")
      setTempRegion("")
    }
  }

  const handleSaveApiKey = () => {
    const updates: Partial<SpeechConfig> = { apiKey: tempApiKey }
    if (config.provider === 'azure' && tempRegion) {
      updates.region = tempRegion
    }
    updateConfig(updates)
    setShowApiKeyDialog(false)
  }

  const getProviderDisplayName = (providerId: string) => {
    const provider = availableProviders.find(p => p.id === providerId)
    return provider?.name || providerId
  }

  const getCurrentProviderName = () => {
    return getProviderDisplayName(config.provider)
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={clearError} className="h-auto p-1">
            ×
          </Button>
        </div>
      )}

      {/* Main TTS Toggle Button */}
      <Button
        variant={isEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleEnabled}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isLoading ? "Loading..." : isEnabled ? "Voice On" : "Voice Off"}
        </span>
      </Button>

      {/* Speech Control Buttons (only show when enabled) */}
      {isEnabled && config.provider === 'browser' && (
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

      {/* Test Button */}
      {isEnabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={testSpeech}
          disabled={isLoading || isSpeaking}
          className="flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          <span className="hidden sm:inline">Test</span>
        </Button>
      )}

      {/* Setup Guide */}
      <SpeechSetupGuide />

      {/* Settings Dropdown */}
      <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Speech Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Provider Selection */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Speech Provider
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between">
                  {getCurrentProviderName()}
                  <Settings className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableProviders.map((provider) => (
                  <DropdownMenuCheckboxItem
                    key={provider.id}
                    checked={config.provider === provider.id}
                    onCheckedChange={() => handleProviderChange(provider.id)}
                    disabled={!provider.supported}
                  >
                    <div className="flex items-center gap-2">
                      {provider.supported ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                      {provider.name}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* API Key Status */}
          {config.provider !== 'browser' && (
            <div className="p-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">API Key:</span>
                <Badge variant={config.apiKey ? "default" : "destructive"} className="text-xs">
                  {config.apiKey ? "Configured" : "Required"}
                </Badge>
              </div>
              {config.provider === 'azure' && config.region && (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Region:</span>
                  <Badge variant="secondary" className="text-xs">
                    {config.region}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Voice Selection */}
          {voices.length > 0 && (
            <div className="p-2">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Voice
              </label>
              <select
                value={config.voice || ""}
                onChange={(e) => updateConfig({ voice: e.target.value })}
                className="w-full p-2 text-xs border rounded bg-background"
              >
                <option value="">Default Voice</option>
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} ({voice.language})
                  </option>
                ))}
              </select>
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Speech Rate */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Speed: {config.rate?.toFixed(1)}x
            </label>
            <Slider
              value={[config.rate || 1]}
              onValueChange={([value]) => updateConfig({ rate: value })}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Speech Pitch */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Pitch: {config.pitch?.toFixed(1)}
            </label>
            <Slider
              value={[config.pitch || 1]}
              onValueChange={([value]) => updateConfig({ pitch: value })}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Speech Volume */}
          <div className="p-2">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Volume: {Math.round((config.volume || 1) * 100)}%
            </label>
            <Slider
              value={[config.volume || 1]}
              onValueChange={([value]) => updateConfig({ volume: value })}
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

      {/* API Key Configuration Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Configure API Key
            </DialogTitle>
            <DialogDescription>
              Enter your API key for {getCurrentProviderName()}.
              {config.provider === 'azure' && " You'll also need to specify your Azure region."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
            
            {config.provider === 'azure' && (
              <div>
                <Label htmlFor="region">Azure Region</Label>
                <Input
                  id="region"
                  value={tempRegion}
                  onChange={(e) => setTempRegion(e.target.value)}
                  placeholder="e.g., eastus, westus2"
                />
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p><strong>How to get API keys:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {config.provider === 'google' && (
                  <li>Go to Google Cloud Console → APIs & Services → Credentials</li>
                )}
                {config.provider === 'elevenlabs' && (
                  <li>Sign up at elevenlabs.io → Profile → API Key</li>
                )}
                {config.provider === 'azure' && (
                  <li>Azure Portal → Cognitive Services → Speech → Keys and Endpoint</li>
                )}
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveApiKey} 
              disabled={!tempApiKey || (config.provider === 'azure' && !tempRegion)}
            >
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
