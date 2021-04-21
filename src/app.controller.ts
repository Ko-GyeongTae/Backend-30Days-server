import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { User } from './entity/User';
import { Token } from './lib/user.decorator';

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
  //@UseGuards(new AuthGuard())
  writeDiary(@Req() request: Request):Promise<string> {
    return this.appService.writeDiary(request);
  }

  @Post('signup')
  //@UseGuards(new AuthGuard())
  signUp(
    @Req() request: Request,
    @Res() response: Response
  ):Promise<string> {
    return this.appService.signUp(request, response);
  }

  @Post('login')
  signIn(
    @Req() request: Request,
    @Res() response: Response
  ):Promise<Object> {
    return this.appService.signIn(request, response);
  }
}
