import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingResponseDto, UpdateSettingDto } from './settings.dto.js';
import { SettingsService } from './settings.service.js';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('value')
  @ApiOperation({ summary: 'Get the placeholder setting value' })
  @ApiOkResponse({ type: SettingResponseDto })
  getValue() {
    return this.settingsService.getValue();
  }

  @Put('value')
  @ApiOperation({ summary: 'Set the placeholder setting value' })
  @ApiBody({ type: UpdateSettingDto })
  @ApiOkResponse({ type: SettingResponseDto })
  setValue(@Body() body: UpdateSettingDto) {
    return this.settingsService.setValue(body.value);
  }
}