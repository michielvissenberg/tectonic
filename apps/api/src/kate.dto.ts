import { ApiProperty } from '@nestjs/swagger';

export const kateMessageRoles = ['customer', 'kate'] as const;
export type KateMessageRole = (typeof kateMessageRoles)[number];

export class KateMessageDto {
  @ApiProperty({ enum: kateMessageRoles, example: 'customer' })
  role!: KateMessageRole;

  @ApiProperty({ example: 'Did our mortgage application for Parklaan 14 come through?' })
  text!: string;
}

export class KateReplyRequestDto {
  @ApiProperty({ type: [KateMessageDto] })
  messages!: KateMessageDto[];
}

export class KateReplyResponseDto {
  @ApiProperty({ example: 'Yes, your application for a home loan of EUR 305,000 is waiting for review by a KBC advisor.' })
  text!: string;

  @ApiProperty({ description: 'True when Kate started a human escalation; text is then her handoff message.', example: false })
  escalate!: boolean;
}

export class KateDossierRequestDto {
  @ApiProperty({ type: [KateMessageDto] })
  messages!: KateMessageDto[];
}

export class KateDossierDocumentDto {
  @ApiProperty({ example: 'Sales agreement (compromis) Parklaan 14' })
  title!: string;

  @ApiProperty({ example: 'Agreement' })
  type!: string;

  @ApiProperty({ example: '30 September 2026' })
  date!: string;

  @ApiProperty({ example: 'The loan condition expires on 18 October 2026 and requires a loan of at least EUR 305,000.' })
  relevance!: string;
}

export class KateDossierResponseDto {
  @ApiProperty({ example: 'Laura asked whether her EUR 305,000 home loan can be approved before the loan condition in her compromis expires on 18 October 2026. Her company has only two years of annual accounts.' })
  summary!: string;

  @ApiProperty({ example: 'Will our loan be approved before the loan condition expires on 18 October?' })
  unresolvedQuestion!: string;

  @ApiProperty({ type: [String], example: ['The application for a EUR 305,000 home loan was received and is waiting for advisor review.'] })
  kateAlreadyChecked!: string[];

  @ApiProperty({ type: [KateDossierDocumentDto] })
  documents!: KateDossierDocumentDto[];

  @ApiProperty({ example: 'Check Studio Laura\'s annual accounts against the income requirements and confirm the 18 October deadline with Laura.' })
  suggestedFirstAction!: string;
}
