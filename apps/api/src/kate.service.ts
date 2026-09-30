import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  ThinkingLevel,
  Type,
  type FunctionDeclaration,
  type GenerateContentConfig,
  type GenerateContentParameters,
  type Part,
} from '@google/genai';
import { dossierSystemInstruction, kateDocuments, kateSystemInstruction } from './kate-context.js';
import type { KateDossierResponseDto, KateMessageDto, KateReplyResponseDto } from './kate.dto.js';

const defaultModel = 'gemini-3.6-flash';
// The repo's `documents/` folder, from both `src/` and the compiled `dist/`.
const documentsDir = join(__dirname, '..', '..', '..', 'documents');
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

// Structured output for the generated part of the escalation dossier. Documents are limited to the synthetic set.
const dossierSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    unresolvedQuestion: { type: 'string' },
    kateAlreadyChecked: { type: 'array', items: { type: 'string' } },
    documents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', enum: kateDocuments.map((document) => document.title) },
          relevance: { type: 'string' },
        },
        required: ['title', 'relevance'],
      },
    },
    suggestedFirstAction: { type: 'string' },
  },
  required: ['summary', 'unresolvedQuestion', 'kateAlreadyChecked', 'documents', 'suggestedFirstAction'],
};

@Injectable()
export class KateService {
  private readonly logger = new Logger(KateService.name);
  private client: GoogleGenAI | null = null;

  async reply(messages: KateMessageDto[]): Promise<KateReplyResponseDto> {
    const response = await this.generate(
      messages.map((message) => ({
        role: message.role === 'customer' ? 'user' : 'model',
        parts: [{ text: message.text }],
      })),
      {
        systemInstruction: kateSystemInstruction,
        tools: [{ functionDeclarations: [startHumanEscalation] }],
        toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO } },
      },
      'Kate could not reply right now.',
    );

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

  async dossier(messages: KateMessageDto[]): Promise<KateDossierResponseDto> {
    const transcript = messages.map((message) => `${message.role === 'customer' ? 'Customer' : 'Kate'}: ${message.text}`).join('\n');
    const response = await this.generate(
      [{ role: 'user', parts: [{ text: `Kate conversation:\n${transcript}` }, ...(await this.documentParts())] }],
      {
        systemInstruction: dossierSystemInstruction,
        responseMimeType: 'application/json',
        responseJsonSchema: dossierSchema,
      },
      'The escalation dossier could not be generated.',
    );

    const dossier = parseDossier(response.text);

    if (!dossier) {
      this.logger.error('Gemini returned an invalid escalation dossier');
      throw new BadGatewayException('The escalation dossier could not be generated.');
    }

    return dossier;
  }

  // The customer's documents as PDF parts, each preceded by its title so Gemini can name it.
  private async documentParts(): Promise<Part[]> {
    const parts = await Promise.all(kateDocuments.map(async (document): Promise<Part[]> => {
      try {
        const data = (await readFile(join(documentsDir, document.file))).toString('base64');
        return [{ text: `Document: ${document.title}` }, { inlineData: { mimeType: 'application/pdf', data } }];
      } catch {
        this.logger.warn(`Document not found, left out of the dossier: ${document.file}`);
        return [];
      }
    }));

    return parts.flat();
  }

  private async generate(contents: GenerateContentParameters['contents'], config: GenerateContentConfig, failureMessage: string) {
    const model = process.env.VERTEX_MODEL || defaultModel;

    return this.getClient()
      .models.generateContent({
        model,
        contents,
        config: {
          temperature: 0.3,
          // Short, grounded output needs little thinking; keeping it minimal keeps Kate responsive.
          thinkingConfig: model.startsWith('gemini-2') ? { thinkingBudget: 0 } : { thinkingLevel: ThinkingLevel.MINIMAL },
          // Fail fast to the fallback instead of backing off for up to a minute on throttling.
          httpOptions: { retryOptions: { attempts: 2 } },
          ...config,
        },
      })
      .catch((error: unknown) => {
        // Log only the error type and status; the SDK error may echo request details.
        const status = (error as { status?: number }).status ?? 'unknown';
        this.logger.error(`Gemini request failed (${(error as Error).name}, status ${status})`);
        throw new BadGatewayException(failureMessage);
      });
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

const nonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

function parseDossier(json: string | undefined): KateDossierResponseDto | null {
  let raw: Record<string, unknown>;

  try {
    raw = JSON.parse(json ?? '');
  } catch {
    return null;
  }

  if (!nonEmptyString(raw?.summary) || !nonEmptyString(raw.unresolvedQuestion) || !nonEmptyString(raw.suggestedFirstAction)) {
    return null;
  }

  const seen = new Set<string>();
  const documents = (Array.isArray(raw.documents) ? raw.documents : []).flatMap((item: { title?: unknown; relevance?: unknown }) => {
    // Drop documents outside the synthetic set, duplicates, and entries without a reason.
    const document = kateDocuments.find(({ title }) => title === item?.title);

    if (!document || seen.has(document.title) || !nonEmptyString(item.relevance)) {
      return [];
    }

    seen.add(document.title);
    return [{ title: document.title, type: document.type, date: document.date, relevance: item.relevance.trim() }];
  });

  return {
    summary: raw.summary.trim(),
    unresolvedQuestion: raw.unresolvedQuestion.trim(),
    kateAlreadyChecked: (Array.isArray(raw.kateAlreadyChecked) ? raw.kateAlreadyChecked : []).filter(nonEmptyString).map((item) => item.trim()),
    documents,
    suggestedFirstAction: raw.suggestedFirstAction.trim(),
  };
}
