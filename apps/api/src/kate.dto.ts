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

export class KateDossierRequestDto {
  @ApiProperty({ type: [KateMessageDto] })
  messages!: KateMessageDto[];
}

export class KateDossierDocumentDto {
  @ApiProperty({ example: 'Repayment schedule' })
  title!: string;

  @ApiProperty({ example: 'Schedule' })
  type!: string;

  @ApiProperty({ example: '01 September 2026' })
  date!: string;

  @ApiProperty({ example: 'Shows the updated monthly amount and future payment breakdown.' })
  relevance!: string;
}

export class KateDossierResponseDto {
  @ApiProperty({ example: 'Sophie asked why her monthly mortgage payment increased. Kate explained the rate adjustment, but Sophie wants a human to check the details.' })
  summary!: string;

  @ApiProperty({ example: 'What exact interest rate does my mortgage agreement use now?' })
  unresolvedQuestion!: string;

  @ApiProperty({ type: [String], example: ['The interest rate was adjusted at the start of September 2026.'] })
  kateAlreadyChecked!: string[];

  @ApiProperty({ type: [KateDossierDocumentDto] })
  documents!: KateDossierDocumentDto[];

  @ApiProperty({ example: 'Open the repayment schedule and confirm the new rate with Sophie.' })
  suggestedFirstAction!: string;
}
