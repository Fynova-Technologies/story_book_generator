import { generateStory }        from '../services/geminiService';
import { transformImage } from '../services/imageService';
import { normalizeReferences, CharacterReference } from '../services/characterReferences';
import { ApiError } from '../utils/ApiError';
import pkg from 'express';
const { Router } = pkg;
import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

let isGeneratingStory = false;

const router = Router();

// ── Generate full story with images ────────────────────────────

router.post('/generate', async (req: Request, res: Response) => {
  req.setTimeout(60000);
  res.setTimeout(60000);

  const {
    template,
    questionnaire,
    artStyle,
    narration,
    images,
    story: storytext,
    storyStyle,
    storyLength,
  } = req.body;

  // console.log(images);
  

  if (!storytext && (!template || !questionnaire || !images)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Missing required fields')
    );
  }

  if (isGeneratingStory) {
    return res.status(429).json(
      new ApiResponse(429, null, 'Story generation already in progress. Please wait for the current request to complete.')
    );
  }

  let references: CharacterReference[];
  try {
    references = normalizeReferences(images);
  } catch (error) {
    return res.status(400).json(new ApiResponse(400, null,
      error instanceof Error ? error.message : 'Invalid reference photos'));
  }

  isGeneratingStory = true;

  try {
    // ── Step 1: Generate story text + image prompts ────────────
    console.log(`Generating ${storyStyle || 'storybook'} story...`);

    let story: any;
    try {
      story = await generateStory({
        template,
        questionnaire,
        artStyle,
        narration,
        storytext:  storytext  || '',
        storyStyle: storyStyle || 'storybook',
        images: references,
        storyLength,
      });
      console.log('Story generated successfully');
      console.log(story);
    } catch (storyError: any) {
      const statusCode = storyError.statusCode || 500;
      const message    = storyError.message || 'Failed to generate story';
      return res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
      );
    }

    // ── Step 2: Generate one image per page from imagePrompt ──
    console.log(`Generating images for ${story.pages.length} pages...`);

// Wait for every page to settle before releasing the generation lock.
const pageResults = await Promise.allSettled(
  story.pages.map(async (page: any) => {
    if (typeof page.imagePrompt !== 'string' || !page.imagePrompt.trim()) {
      throw new Error(`Missing illustration prompt for page ${page.page}`);
    }
    const response = await transformImage(references, story.characterContext, page.imagePrompt);
    if (!response?.success || !response.imageUrl) throw new Error(`Image failed for page ${page.page}`);

    return {
      page:     page.page,
      text:     page.text || '',
      imageUrl: response.imageUrl,
    };
  })
);
const failedPages = pageResults.flatMap((result, index) => result.status === 'rejected' ? [story.pages[index].page] : []);
if (failedPages.length) {
  throw new ApiError(502, `Illustration generation failed for pages ${failedPages.join(', ')}. Please retry; no substitute images were used.`);
}
const pagesWithImages = pageResults.flatMap(result => result.status === 'fulfilled' ? [result.value] : []);

    // ── Step 3: Send response ──────────────────────────────────
    return res.json(
      new ApiResponse(200, {
        title:    story.title,
        subtitle: story.subtitle,
        style:    storyStyle || 'storybook',
        pages:    pagesWithImages,
      })
    );

  } catch (error: any) {
    // console.error('Story generation failed:', error);
    const status = error instanceof ApiError ? error.statusCode : 500;
    return res.status(status).json(
      new ApiResponse(status, null, error.message || 'Internal Server Error')
    );
  } finally {
    isGeneratingStory = false;
  }
  
});

export default router;
