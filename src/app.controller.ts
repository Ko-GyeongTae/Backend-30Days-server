import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('diary')
  getDiary(): string {
    return this.appService.getDiary();
  }

  @Post('write')
  async writeDiary(@Req() request: Request){
    return this.appService.writeDiary(request);
  }
}
