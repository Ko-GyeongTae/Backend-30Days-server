import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
    constructor(
        private readonly diaryService: DiaryService,
    ) { }
    @Get('list')
    getDiary(
        @Req() request: Request
    ): Promise<object> {
        return this.diaryService.getDiary(request);
    }

    @Post('write')
    writeDiary(@Req() request: Request): Promise<string> {
        return this.diaryService.writeDiary(request);
    }
}
