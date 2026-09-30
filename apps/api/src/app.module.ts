import { Module } from '@nestjs/common';
import { KateController } from './kate.controller.js';
import { KateService } from './kate.service.js';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';
import { PrismaService } from './prisma.service.js';

@Module({
	controllers: [SettingsController, KateController],
	providers: [PrismaService, SettingsService, KateService],
})
export class AppModule {}