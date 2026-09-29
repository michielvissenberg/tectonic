import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';
import { PrismaService } from './prisma.service.js';

@Module({
	controllers: [SettingsController],
	providers: [PrismaService, SettingsService],
})
export class AppModule {}