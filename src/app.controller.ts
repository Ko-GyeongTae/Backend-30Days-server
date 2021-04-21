import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { User } from './entity/User';
import { Token } from './lib/user.decorator';
//import AuthGuard from './middleware/auth';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService
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
  //@UseGuards(new AuthGuard())
  writeDiary(@Req() request: Request):Promise<string> {
    return this.appService.writeDiary(request);
  }

  @Post('signup')
  signUp(
    @Req() request: Request,
    @Res() response: Response
  ):Promise<string> {
    return this.appService.signUp(request, response);
  }

  @Post('login')
  signIn(
    @Req() request: Request,
    @Res({passthrough: true}) response: Response
  ):Promise<Object> {
    return this.appService.signIn(request, response);
  }
}
