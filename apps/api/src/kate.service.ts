import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { FunctionCallingConfigMode, GoogleGenAI, ThinkingLevel, Type, type FunctionDeclaration } from '@google/genai';
import { kateSystemInstruction } from './kate-context.js';
import type { KateMessageDto, KateReplyResponseDto } from './kate.dto.js';

const defaultModel = 'gemini-3.6-flash';
const defaultHandoffMessage = 'I\'m sorry, I can\'t resolve this for you myself. I\'ll ask a human teammate to help.';

// Kate's only action: hand the Kate conversation over to a human customer-service worker.
const startHumanEscalation: FunctionDeclaration = {
  name: 'start_human_escalation',
  description: 'Start a human escalation: transfer this conversation to a human customer-service worker. Call this only when you cannot resolve the customer\'s problem from the source context, or when the customer asks for a human.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      handoffMessage: {
        type: Type.STRING,
        description: 'One or two short sentences to the customer, in their language, saying that you cannot resolve this yourself and that a human teammate will help.',
      },
    },
    required: ['handoffMessage'],
  },
};

@Injectable()
export class KateService {
  private readonly logger = new Logger(KateService.name);
  private client: GoogleGenAI | null = null;

  async reply(messages: KateMessageDto[]): Promise<KateReplyResponseDto> {
    const model = process.env.VERTEX_MODEL || defaultModel;
    const response = await this.getClient()
      .models.generateContent({
        model,
        contents: messages.map((message) => ({
          role: message.role === 'customer' ? 'user' : 'model',
          parts: [{ text: message.text }],
        })),
        config: {
          systemInstruction: kateSystemInstruction,
          temperature: 0.3,
          tools: [{ functionDeclarations: [startHumanEscalation] }],
          toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO } },
          // Short, grounded chat replies need little thinking; keeping it minimal keeps Kate responsive.
          thinkingConfig: model.startsWith('gemini-2') ? { thinkingBudget: 0 } : { thinkingLevel: ThinkingLevel.MINIMAL },
          // Fail fast to the fallback reply instead of backing off for up to a minute on throttling.
          httpOptions: { retryOptions: { attempts: 2 } },
        },
      })
      .catch((error: unknown) => {
        // Log only the error type and status; the SDK error may echo request details.
        const status = (error as { status?: number }).status ?? 'unknown';
        this.logger.error(`Gemini request failed (${(error as Error).name}, status ${status})`);
        throw new BadGatewayException('Kate could not reply right now.');
      });

    // Read text parts directly: the `text` getter warns when the response also holds a function call.
    const text = (response.candidates?.[0]?.content?.parts ?? [])
      .filter((part) => typeof part.text === 'string' && !part.thought)
      .map((part) => part.text)
      .join('')
      .trim();
    const escalation = response.functionCalls?.find((call) => call.name === startHumanEscalation.name);

    if (escalation) {
      const handoffMessage = escalation.args?.handoffMessage;
      return {
        text: text || (typeof handoffMessage === 'string' && handoffMessage.trim()) || defaultHandoffMessage,
        escalate: true,
      };
    }

    if (!text) {
      throw new BadGatewayException('Kate could not reply right now.');
    }

    return { text, escalate: false };
  }

  private getClient() {
    const apiKey = process.env.VERTEX_API_KEY;

    if (!apiKey) {
      throw new ServiceUnavailableException('Kate is not configured.');
    }

    // Vertex AI express mode: an API key instead of project/location credentials.
    this.client ??= new GoogleGenAI({ enterprise: true, apiKey });
    return this.client;
  }
}
