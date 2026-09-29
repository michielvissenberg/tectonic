import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getValue() {
    const setting = await this.prisma.setting.findUnique({ where: { id: 1 } });
    return { value: setting?.value ?? '' };
  }

  async setValue(value: string) {
    const setting = await this.prisma.setting.upsert({
      where: { id: 1 },
      create: { id: 1, value },
      update: { value },
    });

    return { value: setting.value };
  }
}