import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Was geeeht';
  }
}
