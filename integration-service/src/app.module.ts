import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), IntegrationsModule],
})
export class AppModule {} 