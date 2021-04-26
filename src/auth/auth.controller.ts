import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { request, Request, response, Response } from 'express';
import { Diary } from 'src/entity/Diary';
import { User } from 'src/entity/User';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    @Get('getUserAll')
    findUserAll(): Promise<User[]>{
        return this.authService.findUserAll();
    }

    @Get('getDiaryAll')
    findPostAll(): Promise<Diary[]> {
        return this.authService.findDiaryAll();
    }
    @Post('signup')
    signUp(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<string> {
        return this.authService.signUp(request, response);
    }

    @Post('login')
    signIn(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<Object> {
        return this.authService.signIn(request, response);
    }

    @Delete('drop')
    dropOut(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<Object> {
        return this.authService.dropOut(request, response);
    }

    @Get('logout')
    signOut(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<Object> {
        return this.authService.logOut(request, response);
    }
}
