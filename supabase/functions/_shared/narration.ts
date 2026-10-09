// Narration audio: the text a page is read aloud with, and text-to-speech via OpenAI or ElevenLabs.
// The script comes from the storyboard, so audio can be made alongside the illustrations, never after.
import process from 'node:process';
import type { Panel } from './storyStyleConfig.ts';
import { trace } from './trace.ts';

export type Provider = 'openai' | 'elevenlabs';
export const TTS_MODELS: Record<Provider, string> = { openai: 'gpt-4o-mini-tts', elevenlabs: 'eleven_v4' };
export const TTS_KEYS: Record<Provider, string> = { openai: 'OPENAI_API_KEY', elevenlabs: 'ELEVENLABS_API_KEY' };

// The wizard's voice ids (VoiceNarrationSection) per provider. ElevenLabs ids are its premade voices.
const VOICES: Record<string, { openai: { voice: string; instructions: string }; elevenlabs: string }> = {
  storyteller:    { openai: { voice: 'marin', instructions: 'A warm, soothing bedtime storyteller. Gentle pace, soft smiles in the voice, clear pauses between sentences.' }, elevenlabs: 'XrExE9yKIg1WjnnlVkGX' }, // Matilda
  adventurer:     { openai: { voice: 'cedar', instructions: 'An energetic, playful adventure narrator. Lively pace, excitement on the big moments, fun character voices for quoted lines.' }, elevenlabs: 'TX3LPaxmHKxFdv7VOQHJ' }, // Liam
  cinematic:      { openai: { voice: 'onyx', instructions: 'A deep, dramatic movie-trailer narrator. Slow, powerful delivery with tension and weight.' }, elevenlabs: 'nPczCjzI2devNBz1zQrb' }, // Brian
  conversational: { openai: { voice: 'coral', instructions: 'A casual, cheerful friend telling a story. Natural, upbeat and modern.' }, elevenlabs: 'cgSgspJ2msm6clMCkdW9' }, // Jessica
};
// Unknown values (e.g. a tone like "warm and funny" in old drafts) read with the default voice.
export const voiceId = (narration: string) => narration in VOICES ? narration : 'storyteller';

// Storybook pages read their printed text; comic and manga pages read the captions and speech drawn into the art.
export function narrationScript(page: { text?: string; panels?: Panel[] }) {
  if (page.text?.trim()) return page.text.trim();
  return (page.panels || []).flatMap(panel => {
    const lines = panel.caption?.trim() ? [panel.caption.trim()] : [];
    const [, speaker, words] = /^([^:"]{1,40}):\s*(.+)$/s.exec(panel.dialogue || '') || [, '', panel.dialogue || ''];
    // Grawlixes like "#@$%!" have nothing to say.
    if (/\p{L}/u.test(words)) lines.push(speaker ? `${speaker.trim()}: "${words.trim()}"` : `"${words.trim()}"`);
    return lines;
  }).join(' ');
}

async function call(url: string, init: RequestInit, name: string) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${name} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return new Uint8Array(await res.arrayBuffer());
}

// One page of speech as MP3 bytes.
export async function speak(provider: Provider, voice: string, text: string, page?: number): Promise<Uint8Array> {
  const v = VOICES[voiceId(voice)];
  const model = TTS_MODELS[provider];
  const started = Date.now();
  try {
    const audio = provider === 'openai'
      ? await call('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env[TTS_KEYS.openai] || ''}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, voice: v.openai.voice, instructions: v.openai.instructions, input: text, response_format: 'mp3' }),
      }, 'OpenAI')
      : await call(`https://api.elevenlabs.io/v1/text-to-speech/${v.elevenlabs}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: { 'xi-api-key': process.env[TTS_KEYS.elevenlabs] || '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: model, text }),
      }, 'ElevenLabs');
    trace('narration', { provider, model, page, chars: text.length, bytes: audio.length, ms: Date.now() - started });
    return audio;
  } catch (error) {
    trace('narration', { provider, model, page, ok: false, error: String(error), ms: Date.now() - started });
    throw error;
  }
}
