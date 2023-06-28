import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PushModule } from './push/push.module';

async function bootstrap() {
  const app = await NestFactory.create(PushModule);
  await app.listen(3000);
}
bootstrap();
