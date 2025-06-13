import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  /* ------------------ Sources ------------------ */
  @Get('sources')
  listSources() {
    return this.integrationsService.listSources();
  }

  @Post('sources')
  createSource(@Body() body: any) {
    return this.integrationsService.createSource(body);
  }

  @Post('sources/:id/sync')
  triggerSync(@Param('id') id: string) {
    return this.integrationsService.triggerSync(id);
  }

  /* ---------------- Connectors ---------------- */
  @Get('connectors')
  listConnectors(@Query('industry') industry: string) {
    return this.integrationsService.listConnectors(industry);
  }
} 