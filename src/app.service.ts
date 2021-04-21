import { BadRequestException, HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';
import { getConnection } from 'typeorm';
import { Post } from './entity/Diary';
import { User } from './entity/User';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService
  ) {}
  private logger = new Logger();
  getHello(): string {
    return 'Hello World!';
  }

  async getDiary(request): Promise<object> {
    try{
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if(!data){
        throw new UnauthorizedException();
      }
      return data;
    } catch(e) {
      throw new UnauthorizedException();
    }
  }

  async writeDiary(request): Promise<string> {
    const req = request.body;
    const token = request.header;
    //token 기능 추가
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({ title: req.title, content: req.content })
      .execute()
      .catch(Error => {
        this.logger.log(`Fail to write Diary`);
        return "Fail to write Diary";
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
    if(!user){
      throw new BadRequestException('invalid credentials');
    } else {
      const jwt = await this.jwtService.signAsync({ id: user.uid, name: user.name });
      //response.cookie('jwt', jwt, {httpOnly: true});
      return response.status(200).json({
        status: 200,
        message: 'Success to login',
        access_token: jwt,
      });
    }
  }
}
