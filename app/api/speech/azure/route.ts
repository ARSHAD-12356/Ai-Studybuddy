import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      text, 
      apiKey, 
      region, 
      voice = 'en-US-AriaNeural', 
      rate = 1.0, 
      pitch = 1.0, 
      volume = 1.0 
    } = await request.json()

    if (!text || !apiKey || !region) {
      return NextResponse.json({ error: 'Text, API key, and region are required' }, { status: 400 })
    }

    // Get Azure access token
    const tokenResponse = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get Azure access token' },
        { status: tokenResponse.status }
      )
    }

    const accessToken = await tokenResponse.text()

    // Create SSML with voice settings
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${voice}">
          <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
            ${text}
          </prosody>
        </voice>
      </speak>
    `

    // Azure Cognitive Services Speech API
    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'AI-StudyBuddy',
        },
        body: ssml,
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Azure TTS API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Azure TTS error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
