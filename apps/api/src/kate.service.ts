import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { kateSystemInstruction } from './kate-context.js';
import type { KateMessageDto } from './kate.dto.js';

const defaultModel = 'gemini-3.6-flash';

@Injectable()
export class KateService {
  private readonly logger = new Logger(KateService.name);
  private client: GoogleGenAI | null = null;

  async reply(messages: KateMessageDto[]) {
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

    const text = response.text?.trim();

    if (!text) {
      throw new BadGatewayException('Kate could not reply right now.');
    }

    return { text };
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
