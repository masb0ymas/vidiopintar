import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { trackGenerateTextUsage } from '@/lib/token-tracker';
import { getCurrentUser } from '@/lib/auth';

export async function generateSummary(text: string, videoId?: string, userVideoId?: number): Promise<string> {
  // Limit the input to the first 4000 words to speedup the generation
  const MAX_WORDS = 4000;
  let truncatedText = text;
  const words = text.split(/\s+/);
  if (words.length > MAX_WORDS) {
    truncatedText = words.slice(0, MAX_WORDS).join(' ');
  }

  const systemPrompt = `
Please provide a detailed, well-structured summary of this YouTube video transcript.

Your summary should:

1. Identify the main topic and key themes discussed in the content
2. Break down the information into logical sections with clear headings
3. Highlight important concepts, arguments, or insights presented
4. Include relevant examples, data points, and notable quotes
5. Capture any methodologies, frameworks, or step-by-step processes explained
6. Note significant challenges or opposing viewpoints mentioned
7. Extract practical takeaways or lessons that viewers can apply
8. Maintain the nuance and depth of the original content while making it more accessible
9. Present information in a cohesive narrative flow rather than just bullet points
10. Add recommendations for next steps or actions to take after watching the video

Format your output with this markdown structure:

## Summary

## Outline (make it short just the headline)

## Key Takeaways

## Next Steps
`;

    const startTime = Date.now();
    const result = await generateText({
        model: google('gemini-2.0-flash-001'),
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: `INPUT:\n${truncatedText}`
            }
        ]
    });
    
    // Track token usage
    try {
        const user = await getCurrentUser();
        await trackGenerateTextUsage(result, {
            userId: user.id,
            model: 'gemini-2.0-flash-001',
            provider: 'google',
            operation: 'summary',
            videoId,
            userVideoId,
            requestDuration: Date.now() - startTime,
        });
    } catch (error) {
        console.error('Failed to track summary token usage:', error);
    }
    
    return result.text;
}
