import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingDto {
  @ApiProperty({ example: 'Hello from Tectonic' })
  value!: string;
}

export class SettingResponseDto {
  @ApiProperty({ example: 'Hello from Tectonic' })
  value!: string;
}