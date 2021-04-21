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

  async signUp(request, response): Promise<string> {
    const req = request.body;
    const check = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.name = :name", { name: req.name })
      .getOne();
    if (check === undefined) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ name: req.name, password: req.password })
        .execute()
        .catch(Error => {
          this.logger.log(`Fail to signup User: ${req.name}`);
          return new HttpException('Fail to signup', 400);
        });
      this.logger.log(`Success to signup User: ${req.name}`);
      return response.status(200).json({
        status: 200,
        message: "Success to signup"
      })
    } else {
      this.logger.log("Same name is already exist!");
      return response.status(400).json({
        status: 400,
        message: "Same name is already exist!"
      });
    }
  }

  async signIn(request, response): Promise<Object> {
    const req = request.body;

    const user = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.password = :password && user.name = :name", { password: req.password, name: req.name })
      .getOne();
    this.logger.log(`${request.method} : ${request.url} : ${req.name}`);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: user.uid, name: user.name });
    response.cookie('jwt', jwt, { httpOnly: false });
    return response.status(200).json({
      status: 200,
      message: 'Success to login',
      access_token: jwt,
    });

  }
}
