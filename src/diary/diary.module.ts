import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';

@Module({
  imports: [
    JwtModule.register({ 
      secret: 'secret',
      signOptions: {expiresIn: '3h'} 
    })
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService]
})
export class DiaryModule {}
