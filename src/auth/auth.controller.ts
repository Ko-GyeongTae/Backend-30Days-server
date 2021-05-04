import { Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { request, Request, response, Response } from 'express';
import { Diary } from 'src/entity/Diary';
import { User } from 'src/entity/User';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Get('getUserAll')
    findUserAll(): Promise<User[]> {
        return this.authService.findUserAll();
    }

    @Get('getDiaryAll')
    findPostAll(): Promise<Diary[]> {
        return this.authService.findDiaryAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('myprofile')
    myProfile(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<object> {
        console.log(request.cookies);
        return this.authService.getProfile(request, response);
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

    @UseGuards(LocalAuthGuard)
    @Post('middle')
    login(@Req() req) {
        return this.authService.login(req.user);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        //console.log(req);
        return 'profile';
    }
}
