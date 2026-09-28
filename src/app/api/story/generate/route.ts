import { createStory } from '@/server/services/storyPipeline';
import { normalizeReferences, CharacterReference } from '@/server/services/characterReferences';
import { ApiResponse } from '@/server/utils/ApiResponse';

// Story + illustrations take 1-2 minutes.
export const maxDuration = 300;

// ponytail: in-process lock, only holds with a single server instance.
let isGeneratingStory = false;

const reply = (status: number, data: unknown, message?: string) =>
  Response.json(new ApiResponse(status, data, message), { status });

// ── Generate full story with images ────────────────────────────
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return reply(400, null, 'Invalid JSON body');

  const {
    template,
    questionnaire,
    artStyle,
    narration,
    images,
    story: storytext,
    storyStyle,
    storyLength,
  } = body;

  if (!storytext && (!template || !questionnaire || !images)) {
    return reply(400, null, 'Missing required fields');
  }

  if (isGeneratingStory) {
    return reply(429, null, 'Story generation already in progress. Please wait for the current request to complete.');
  }

  let references: CharacterReference[];
  try {
    references = normalizeReferences(images);
  } catch (error) {
    return reply(400, null, error instanceof Error ? error.message : 'Invalid reference photos');
  }

  isGeneratingStory = true;

  try {
    const story = await createStory({
      template,
      questionnaire,
      artStyle,
      narration,
      storytext:  storytext  || '',
      storyStyle: storyStyle || 'storybook',
      storyLength,
    }, references);
    return reply(200, story);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return reply(status, null, error.message || 'Internal Server Error');
  } finally {
    isGeneratingStory = false;
  }
}
