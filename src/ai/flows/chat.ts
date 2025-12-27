'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const continueChatFlow = ai.defineFlow(
  {
    name: 'continueChatFlow',
    inputSchema: z.array(ChatMessageSchema),
    outputSchema: z.string(),
  },
  async (messages) => {
    const systemInstruction = "You are RaktSahayak, a helpful assistant for a blood donation app. Your name means 'Blood Helper'. Answer questions about blood eligibility, safety, and post-donation care. Keep answers short and encouraging. If the user asks about unrelated topics, politely refuse by saying 'As RaktSahayak, I can only answer questions related to blood donation. How can I help you with that?'";
    
    // FIX 1: Convert the simple string content to Genkit's expected format
    // Genkit expects content to be an array of parts: [{ text: "..." }]
    const genkitHistory = messages.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }] 
    }));

    const response = await ai.generate({
      // FIX 2: Use the newer model (1.5 is retired/404)
      model: 'googleai/gemini-1.5-flash-001', 
      system: systemInstruction,
      messages: genkitHistory, // <--- Pass the converted history here
      config: {
        temperature: 0.9,
      },
    });

    return response.text;
  }
);

export async function continueChat(messages: ChatMessage[]): Promise<string> {
    return await continueChatFlow(messages);
}
