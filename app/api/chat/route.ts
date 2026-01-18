import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from '@/lib/solvang-data';
import { getAllContentForChatbot } from '@/lib/contentful';
import { richTextToPlainText } from '@/lib/richTextUtils';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Build dynamic knowledge base from CMS content
async function buildKnowledgeBase() {
  try {
    const { departments, pages, news, events } = await getAllContentForChatbot();

    let knowledge = '\n\n## LIVE CMS CONTENT:\n\n';

    // Add departments
    knowledge += '### City Departments:\n';
    for (const dept of departments) {
      const fields = dept.fields as any;
      knowledge += `\n**${fields.name}**\n`;
      if (fields.description) {
        knowledge += `Description: ${richTextToPlainText(fields.description)}\n`;
      }
      if (fields.phone) knowledge += `Phone: ${fields.phone}\n`;
      if (fields.email) knowledge += `Email: ${fields.email}\n`;
      if (fields.address) knowledge += `Address: ${fields.address}\n`;
      if (fields.content) {
        knowledge += `Details: ${richTextToPlainText(fields.content)}\n`;
      }
    }

    // Add pages
    knowledge += '\n### Information Pages:\n';
    for (const page of pages) {
      const fields = page.fields as any;
      knowledge += `\n**${fields.title}** (/${fields.slug})\n`;
      if (fields.content) {
        knowledge += `${richTextToPlainText(fields.content)}\n`;
      }
    }

    // Add news
    knowledge += '\n### Recent News:\n';
    for (const item of news) {
      const fields = item.fields as any;
      knowledge += `\n**${fields.title}** (${fields.publishDate})\n`;
      if (fields.excerpt) knowledge += `${fields.excerpt}\n`;
    }

    // Add events
    knowledge += '\n### Upcoming Events:\n';
    for (const event of events) {
      const fields = event.fields as any;
      knowledge += `\n**${fields.title}** - ${fields.date}`;
      if (fields.time) knowledge += ` at ${fields.time}`;
      if (fields.location) knowledge += ` (${fields.location})`;
      knowledge += '\n';
      if (fields.description) {
        knowledge += `${richTextToPlainText(fields.description)}\n`;
      }
    }

    return knowledge;
  } catch (error) {
    console.error('Error fetching CMS content for chatbot:', error);
    return '';
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Fetch live CMS content
    const cmsKnowledge = await buildKnowledgeBase();
    const enhancedSystemPrompt = systemPrompt + cmsKnowledge;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: enhancedSystemPrompt,
      messages: anthropicMessages,
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === 'text');
    const assistantMessage = textContent?.type === 'text' ? textContent.text : 'I apologize, but I encountered an issue. Please try again or call City Hall at (805) 688-5575.';

    return Response.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);

    // Provide a helpful fallback message
    return Response.json(
      {
        message: "I'm having trouble connecting right now. For immediate assistance, please call City Hall at (805) 688-5575 or visit us at 1644 Oak Street, Solvang, CA 93463. We're open Monday-Friday, 8 AM to 5 PM.",
        error: true,
      },
      { status: 500 }
    );
  }
}
