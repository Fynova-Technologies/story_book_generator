import { generateStory }        from '../services/geminiService';
import { generateImageFromText } from '../services/imageService';
import pkg from 'express';
const { Router } = pkg;
import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// ── Generate full story with images ────────────────────────────
router.post('/generate', async (req: Request, res: Response) => {
  req.setTimeout(120000);
  res.setTimeout(120000);

  const {
    template,
    questionnaire,
    artStyle,
    narration,
    images,
    story: storytext,
    storyStyle,
  } = req.body;
  let imgprompts: string[] = [];

  if (!storytext && (!template || !questionnaire)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Missing required fields')
    );
  }

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
        images:     images     || [],   // ← pass images with URLs + descriptions
      });
      console.log('Story generated successfully');
      console.log(story);
      imgprompts = story.pages.map((page: any) => page.imagePrompt);
    } catch (storyError: any) {
      const statusCode = storyError.statusCode || 500;
      const message    = storyError.message || 'Failed to generate story';
      return res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
      );
    }

    // ── Step 2: Generate one image per page from imagePrompt ──
    console.log(`Generating images for ${story.pages.length} pages...`);

    const pagesWithImages = await Promise.all(
      story.pages.map(async (page: any) => {
        const prompt   = page.imagePrompt || '';
        let   imageUrl: string | null = null;

        try {
          // use only generateImageFromText — imagePrompt from Gemini
          // already contains character context + art style + scene details
          const response = await generateImageFromText(prompt);
          imageUrl = response?.imageUrl || null;
          // console.log(imageUrl);
          

        } catch (err) {
          console.error(`Image failed for page ${page.page}:`, err);
          // fallback to Pollinations
          const encoded = encodeURIComponent(prompt);
          imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true`;
        }

        return {
          page:     page.page,
          text:     page.text     || '',
          imageUrl,
        };
      })
    );

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
    return res.status(500).json(
      new ApiResponse(500, null, error.message || 'Internal Server Error')
    );
  }
  // console.log(imgprompts);
  
});

export default router;