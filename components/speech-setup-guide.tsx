"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Volume2, 
  Key, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Zap,
  Crown
} from "lucide-react"

interface SpeechSetupGuideProps {
  className?: string
}

export function SpeechSetupGuide({ className }: SpeechSetupGuideProps) {
  const [isOpen, setIsOpen] = useState(false)

  const providers = [
    {
      id: 'browser',
      name: 'Browser Speech',
      icon: Globe,
      description: 'Built-in browser voices (free)',
      pros: ['No setup required', 'Works offline', 'Free'],
      cons: ['Limited voice quality', 'Browser dependent'],
      setup: null,
      color: 'bg-blue-500'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      icon: Crown,
      description: 'AI-powered natural voices',
      pros: ['High-quality AI voices', 'Natural speech', 'Multiple languages'],
      cons: ['Requires API key', 'Usage limits'],
      setup: {
        steps: [
          'Go to elevenlabs.io',
          'Sign up for a free account',
          'Navigate to Profile → API Keys',
          'Copy your API key',
          'Paste it in the speech settings'
        ],
        link: 'https://elevenlabs.io',
        freeTier: '10,000 characters/month'
      },
      color: 'bg-purple-500'
    },
    {
      id: 'google',
      name: 'Google Cloud TTS',
      icon: Zap,
      description: 'Professional Google voices',
      pros: ['High quality', 'Reliable', 'Multiple voices'],
      cons: ['Requires Google Cloud setup', 'Pay per use'],
      setup: {
        steps: [
          'Go to Google Cloud Console',
          'Create a new project or select existing',
          'Enable Text-to-Speech API',
          'Create credentials (API key)',
          'Copy the API key to speech settings'
        ],
        link: 'https://console.cloud.google.com',
        freeTier: '$300 credit for new users'
      },
      color: 'bg-green-500'
    },
    {
      id: 'azure',
      name: 'Azure Cognitive Services',
      icon: Volume2,
      description: 'Microsoft neural voices',
      pros: ['Neural voices', 'High quality', 'Good pricing'],
      cons: ['Requires Azure account', 'More complex setup'],
      setup: {
        steps: [
          'Go to Azure Portal',
          'Create a Speech resource',
          'Copy the API key and region',
          'Enter both in speech settings'
        ],
        link: 'https://portal.azure.com',
        freeTier: '5 hours/month free'
      },
      color: 'bg-blue-600'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Key className="w-4 h-4 mr-2" />
          Setup Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Speech API Setup Guide
          </DialogTitle>
          <DialogDescription>
            Choose a speech provider and follow the setup instructions to enable high-quality text-to-speech.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => {
            const Icon = provider.icon
            return (
              <Card key={provider.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${provider.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>{provider.description}</CardDescription>
                      </div>
                    </div>
                    {provider.id === 'browser' && (
                      <Badge variant="secondary">Recommended</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Pros */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Pros
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {provider.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Cons
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {provider.cons.map((con, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-orange-500 rounded-full" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Setup Instructions */}
                  {provider.setup && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Setup Instructions</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {provider.setup.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="font-medium text-primary">{index + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      
                      <div className="mt-3 space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(provider.setup!.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open {provider.name}
                        </Button>
                        
                        {provider.setup.freeTier && (
                          <div className="text-xs text-muted-foreground text-center">
                            Free tier: {provider.setup.freeTier}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Browser provider note */}
                  {provider.id === 'browser' && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Start here!</strong> Browser Speech works immediately without any setup. 
                        Try it first, then upgrade to a premium provider for better quality.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Quick Start</h3>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Try Browser Speech first (no setup required)</li>
            <li>2. Click the speech toggle button in the chat header</li>
            <li>3. Click the settings gear icon to configure</li>
            <li>4. For premium voices, choose a provider and add your API key</li>
            <li>5. Test the speech with the "Test" button</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}
