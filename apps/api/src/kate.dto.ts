import { ApiProperty } from '@nestjs/swagger';

export const kateMessageRoles = ['customer', 'kate'] as const;
export type KateMessageRole = (typeof kateMessageRoles)[number];

export class KateMessageDto {
  @ApiProperty({ enum: kateMessageRoles, example: 'customer' })
  role!: KateMessageRole;

  @ApiProperty({ example: 'Why did my monthly mortgage payment change?' })
  text!: string;
}

export class KateReplyRequestDto {
  @ApiProperty({ type: [KateMessageDto] })
  messages!: KateMessageDto[];
}

export class KateReplyResponseDto {
  @ApiProperty({ example: 'Your interest rate was adjusted at the start of September.' })
  text!: string;

  @ApiProperty({ description: 'True when Kate started a human escalation; text is then her handoff message.', example: false })
  escalate!: boolean;
}
