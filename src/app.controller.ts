import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello() {
    return {
      // DB_NAME=db.sqlite
      // COOKIE_KEY=blablaDev
      // PORT=3000
      DB_NAME: this.configService.get<string>('DB_NAME'),
      COOKIE_KEY: this.configService.get<string>('COOKIE_KEY'),
      PORT: this.configService.get<string>('PORT'),
    };
    // return this.appService.getHello();
  }
}
