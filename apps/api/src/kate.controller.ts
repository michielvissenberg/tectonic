import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KateReplyRequestDto, KateReplyResponseDto, kateMessageRoles, type KateMessageDto } from './kate.dto.js';
import { KateService } from './kate.service.js';

const maxMessages = 40;
const maxMessageLength = 2000;

@ApiTags('kate')
@Controller('kate')
export class KateController {
  constructor(private readonly kateService: KateService) {}

  @Post('reply')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Kate\'s next reply to the Kate conversation' })
  @ApiBody({ type: KateReplyRequestDto })
  @ApiOkResponse({ type: KateReplyResponseDto })
  reply(@Body() body: KateReplyRequestDto) {
    return this.kateService.reply(parseMessages(body?.messages));
  }
}

function parseMessages(messages: unknown): KateMessageDto[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > maxMessages) {
    throw new BadRequestException(`messages must contain 1 to ${maxMessages} messages.`);
  }

  const parsed = messages.map((message: Partial<KateMessageDto>) => {
    if (!kateMessageRoles.includes(message?.role as KateMessageDto['role'])
      || typeof message.text !== 'string'
      || !message.text.trim()
      || message.text.length > maxMessageLength) {
      throw new BadRequestException('Each message needs a valid role and non-empty text.');
    }

    return { role: message.role as KateMessageDto['role'], text: message.text };
  });

  if (parsed[0].role !== 'customer' || parsed[parsed.length - 1].role !== 'customer') {
    throw new BadRequestException('The conversation must start and end with a customer message.');
  }

  return parsed;
}
