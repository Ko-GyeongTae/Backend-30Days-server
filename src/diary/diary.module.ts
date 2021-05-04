import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30s' }
    }),
  ],
  controllers: [DiaryController],
  providers: [DiaryService, JwtStrategy],
  exports: [DiaryService]
})
export class DiaryModule { }
