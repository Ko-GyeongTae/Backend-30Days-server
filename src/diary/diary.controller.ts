import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DiaryService } from './diary.service';
import { JwtAuthGuard } from '../middleware/local-auth.guard';

@Controller('diary')
export class DiaryController {
    constructor(
        private readonly diaryService: DiaryService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    getDiary(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<object> {
        return this.diaryService.getDiary(request, response);
    }

    @UseGuards(JwtAuthGuard)
    @Post('write')
    writeDiary(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<string> {
        return this.diaryService.writeDiary(request, response);
    }
}
