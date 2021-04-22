import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('diary')
  getDiary(
    @Req() request: Request
  ):Promise<object> {
    return this.appService.getDiary(request);
  }

  @Post('write')
  writeDiary(@Req() request: Request):Promise<string> {
    return this.appService.writeDiary(request);
  }  
}
