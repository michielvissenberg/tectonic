import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

// Load apps/api/.env (secrets such as VERTEX_API_KEY stay server-side and uncommitted).
try {
  process.loadEnvFile();
} catch {
  // No .env file: rely on the process environment.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });
  const config = new DocumentBuilder()
    .setTitle('Tectonic API')
    .setDescription('Tectonic API contract')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();