import { generateStory }        from '../services/promptService';
import { generateImageFromText, transformImage } from '../services/imageService';
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

  // console.log(images);
  

  if (!storytext && (!template || !questionnaire || !images)) {
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
    } catch (storyError: any) {
      const statusCode = storyError.statusCode || 500;
      const message    = storyError.message || 'Failed to generate story';
      return res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
      );
    }

    // ── Step 2: Generate one image per page from imagePrompt ──
    console.log(`Generating images for ${story.pages.length} pages...`);

// extract all valid user photos once — used as reference for every page
// const allUserPhotos: string[] = (images || [])
//   .filter((img: any) => img?.image && img.image.trim() !== '')
//   .map((img: any) => img.image as string);

// console.log(`User photos available: ${allUserPhotos.length}`);

const pagesWithImages = await Promise.all(
  story.pages.map(async (page: any) => {
    const prompt = page.imagePrompt || '';
    let imageUrl: string | null = null;

    try {
      let response;

      // if (allUserPhotos.length > 0) {
      //   response = await transformImage(allUserPhotos, prompt);
      // } else {
      //   // no user photos → generate from text prompt only
      //   response = await generateImageFromText(prompt);
      // }
      response = await generateImageFromText(prompt);


      imageUrl = response?.imageUrl || null;

    } catch (err) {
      console.error(`Image failed for page ${page.page}:`, err);
      // fallback to Pollinations
      const encoded = encodeURIComponent(prompt);
      imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true`;
    }

    return {
      page:     page.page,
      text:     page.text || '',
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
  
});

export default router;