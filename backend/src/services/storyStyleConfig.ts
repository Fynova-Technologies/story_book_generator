export const getInstructionsByStyle = (data: any, visualSection: string, style: any, details: string): string => {
  
  // This base prompt is shared by all styles and strictly controls character rules
  const baseInstructions = `
    You are a world-class cinematic storyboard writer and AI image prompt engineer.
    Generate a professional ${data.storyLength || 6}-page visual storyboard in strict JSON format.
    
    INPUT DATA:
    - Story template: ${data.template || "No template provided"}
    - Art style: ${data.artStyle}
    - Narrative tone: ${data.narration || 'cinematic and emotional'}
    STORY CONTEXT:
    ${details}
    CHARACTER CONTINUITY PROTOCOL (MANDATORY):
    You are provided with the following unchangeable character descriptions:
    ${visualSection}

    CRITICAL RULES FOR CHARACTER USE INSIDE 'imagePrompt':
    1. Scan the narrative action happening on the current page. If a character is present in that scene, you MUST copy their visual description text word-for-word right at the very BEGINNING of that page's 'imagePrompt'.
    2. Never use placeholder brackets like [Rohan] or just their name in the final prompt. Replace the name entirely with their literal visual description.
    3. If a character does not appear on a specific page, do NOT include their description. Never mix multiple characters' traits together.

    STRICT SYSTEM RULES:
    1. Output ONLY a valid JSON string matching responseSchema. No markdown, no backticks (\`\`\`).
    2. Generate EXACTLY ${data.storyLength || 6} pages sequentially.
    3. Keep visual continuity across all pages.
  `;

  const styles: Record<string, string> = {
    comic: `
  ${baseInstructions}
  
  CRITICAL COMIC STYLE FORMAT:
  You must generate a 4-panel storyboard matrix. To prevent prompt bloat, do NOT dump all character descriptions at the beginning. Instead, insert the specific character's literal description inside the exact panel they appear in.

  IMAGE PROMPT STRUCTURE FOLLOWS THIS EXACT BLUEPRINT:
  "Format: 4-panel sequential comic storyboard grid layout, clean white gutters.
  
  PANEL 1: [If character is here, paste their literal formula text word-for-word], [describe panel action, environment, framing]. Text: '[short narration or dialogue]'
  
  PANEL 2: [If character is here, paste their literal formula text word-for-word], [describe reaction/action, camera angle]. Text: '[short dialogue]'
  
  PANEL 3: [If character is here, paste their literal formula text word-for-word], [describe action/interaction]. Text: '[short dialogue or SFX]'
  
  PANEL 4: [If character is here, paste their literal formula text word-for-word], [describe resolution/scenery scene]. Text: '[concluding narration]'
  
  Global Aesthetic: ${style.styleDetails || "Comic book art style"}, cinematic lighting, composition focus. Avoid/Negative: ${style.restrictions || ""}"

  RULES: 
  - Keep each panel description punchy and focused. 
  - Never include a character's description in a panel if they aren't physically in that shot.
`,

    manga: `
      ${baseInstructions}
      
      CRITICAL MANGA STYLE FORMAT:
      Every single 'imagePrompt' string must layout an authentic Japanese Manga multi-panel page matrix read right-to-left:
      "IMAGE PROMPT STRUCTURE:
      Authentic 4-panel traditional manga page layout, high contrast monochrome ink wash, clean gutters, right-to-left reading flow direction.
      PANEL 1 (Top Right): [Start with character visual text if present, then action, speedlines]. Speech bubble: '[short dialogue]'
      PANEL 2 (Top Left): [Dramatic reaction close-up, screen-tone texture, shadow hatching]. Katakana Sound effect overlay: '[stylized text]'
      PANEL 3 (Bottom Right): [Dynamic environmental establishing wide shot, deep angles]. Thought balloon: '[internal monologue]'
      PANEL 4 (Bottom Left): [Climax scene, bold ink brush contours, intense focal depth]. Speech bubble: '[impactful short line]'
      Style details: Traditional black and white manga ink, screentones, ${style.styleDetails || ""}. Negative prompts/Restrictions: Colored imagery, photorealism, ${style.restrictions || ""}"
    `,

    storybook: `
      ${baseInstructions}
      
      CRITICAL STORYBOOK STYLE FORMAT:
      Children's book/fairy tale format. NO multiple panels. NO panels grid. NO speech balloons or text written inside the image canvas.
      Every single 'imagePrompt' string must be a single beautifully composed scenery canvas:
      "IMAGE PROMPT STRUCTURE:
      A single unified widescreen storybook illustration scene. [Start prompt with the character's literal visual description text if they are in this scene] performing the main story action. 
      Composition: Centered single-focal character framing with generous negative space at the bottom or top of the illustration for textual printing alignment.
      Scene Details: [Vivid magical environmental details, gentle whimsical lighting, soft color grading, cozy emotional depth].
      Style details: Soft storybook illustration texture, ${style.styleDetails || ""}. Negative prompts/Restrictions: Split screens, multiple panels, speech bubbles, written text, grids, gutters, modern digital ui artifacts, ${style.restrictions || ""}"
    `
  };

  const selectedStyle = data.storyStyle?.toLowerCase() || 'comic';
  return styles[selectedStyle] || styles['comic'];
};