import { generateStoryText } from '../services/geminiService';
import { generateImageFromText, transformImage } from '../services/imageService';
import { generateImagePrompt } from '../services/imagePromptService';
import pkg from 'express';
const { Router } = pkg;
import type { Request, Response } from 'express';

const router = Router();

// ── Helper: Build optimized image prompt ───────────────────────
const buildImagePrompt = (text: string, artStyle: string) => {
  return `${text.substring(0, 60)}, ${artStyle} style, storybook illustration`;
};

// router.post('/generateImagePrompt', async (req: Request, res: Response) => {
//   const { story, artStyle } = req.body;
//   if (!story || !artStyle) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const imagePrompts = await generateImagePrompt(story, artStyle);
//     res.json({
//       success: true,
//       imagePrompts,
//     });
//   } catch (error: any) {
//     console.error('Image generation failed:', error);

//     res.status(500).json({
//       success: false,
//       message:"Exit from /generateImagePrompt",
//       error: error.message || 'Internal Server Error',
//     });
//   }
// });


// ── Generate full story with images ────────────────────────────
router.post('/generate', async (req: Request, res: Response) => {
   // set longer timeout
  req.setTimeout(120000);   // 2 minutes
  res.setTimeout(120000);
  const { template, questionnaire, artStyle, narration, images, story:storyText } = req.body;

  if (!storyText && (!template || !questionnaire)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let story;

    if (storyText) {
      // Step 1 — Use provided story and generate image prompts
      console.log('Story text provided; generating image prompts...');
      story = await generateImagePrompt(storyText, artStyle || 'storybook');

      if (!story?.pages || !Array.isArray(story.pages)) {
        throw new Error('Invalid image prompt response');
      }

      story = {
        title: story.title,
        subtitle: story.subtitle,
        pages: story.pages.map((page: any) => ({
          page: page.page,
          text: '',
          imagePrompt: page.imagePrompt,
        })),
      };
    } else {
      // Step 1 — Generate story text
      console.log('Generating story text...');
      story = await generateStoryText({
        template,
        questionnaire,
        artStyle,
        narration,
      });
      console.log('Story generated successfully');
    }

    // Step 2 — Prepare user images
    const userPhotos = (images || [])
      .filter((img: any) => img?.image)
      .map((img: any) => img.image);

    // Step 3 — Generate images per page
    console.log('Generating images...');

    const pagesWithImages = await Promise.all(
      story.pages.map(async (page: any, index: number) => {
        // ✅ Limit images to page count
          const userPhoto =
            userPhotos.length > 0
              ? userPhotos[index % userPhotos.length]
              : null;

        // ✅ Build prompt (story + art style)
        // const prompt = buildImagePrompt(page.text, artStyle);
        // console.log("Prompt : ",prompt);
        const prompt = page.imagePrompt;
        // console.log("Prompt : ",prompt);
        

        let imageUrl: string | null = null;

        try {
          // throw new Error('Image generation skipped for testing');
          let response;

          if (userPhoto) {
            // ✅ Image-to-image
            console.log("Image found");
            
            response = await transformImage(userPhoto, prompt);
          } else {
            // ✅ Text-to-image
            console.log("Image not found");
            
            response = await generateImageFromText( prompt);
          }

          if (response?.imageUrl) {
            imageUrl = response.imageUrl;
          } else {
            imageUrl = null;
          }
          // console.log("ImageURL:  ",imageUrl);
          
        } catch (err) {
          console.error(`Image failed for page ${page.page}:`, err);

          // ✅ Fallback image generator
          const encoded = encodeURIComponent(prompt);
          imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true`;
        }

        return {
          page:page.page,
          text:page.text,
          imageUrl,
        };
      })
    );

    // Step 4 — Send response

    res.json({
      success: true,
      story: {
        title: story.title,
        subtitle: story.subtitle,
        pages: pagesWithImages,
      },
    });

  } catch (error: any) {
    console.error('Story generation failed:', error);

    res.status(500).json({
      success: false,
      message:"Exit from /generate",
      error: error.message || 'Internal Server Error',
    });
  }
});


export default router;