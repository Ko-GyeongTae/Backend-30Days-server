import { BadRequestException, HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from 'typeorm';
import { Post } from './entity/Diary';
import { User } from './entity/User';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService
  ) { }
  private logger = new Logger();
  getHello(): string {
    return 'Hello World!';
  }

  async getDiary(request): Promise<object> {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      console.log(data);
      if (data === undefined) {
        throw new UnauthorizedException();
      }
      const diary = await getConnection()
        .createQueryBuilder()
        .select('post')
        .from(Post, 'post')
        .where('post.userUid = :userUid', { userUid: data.id })
        .getMany();
      if (diary.length === 0) {
        throw new HttpException('Not Found', 404);
      }
      return diary;
    } catch (e) {
      throw new HttpException("Fail to get diary list", 404);
    }
  }

  async writeDiary(request): Promise<string> {
    const req = request.body;
    const cookie = request.cookies['jwt'];
    if (!cookie) {
      throw new HttpException('Not found Authorization', 400);
    }
    const data = await this.jwtService.verifyAsync(cookie);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({ userUid: data.id, title: req.title, content: req.content })
      .execute()
      .catch(Error => {
        console.log(Error);
        this.logger.log(`Fail to write Diary`);
        throw new HttpException(`Fail to write Diary`, 400);
      });
    this.logger.log(`Success to write Diary Title: ${req.title}`);
    return 'Success to write Diary';
  }

  
}
