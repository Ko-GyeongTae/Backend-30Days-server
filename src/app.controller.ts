import { Controller, Get, Post, Req } from '@nestjs/common';
import { request, Request } from 'express';
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
  writeDiary(@Req() request: Request):Promise<string> {
    return this.appService.writeDiary(request);
  }

  @Post('signup')
  signUp(@Req() request: Request):Promise<string> {
    return this.appService.signUp(request);
  }

  @Post('login')
  signIn(@Req() request: Request):Promise<string> {
    return this.appService.signIn(request);
  }
}
