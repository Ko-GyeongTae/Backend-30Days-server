import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
    constructor(
        private readonly diaryService: DiaryService,
    ) { }
    @Get('list')
    getDiary(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<object> {
        return this.diaryService.getDiary(request, response);
    }

    @Post('write')
    writeDiary(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<string> {
        return this.diaryService.writeDiary(request, response);
    }
}
