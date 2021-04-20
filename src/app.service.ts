import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Post } from './entity/Diary';
import { User } from './entity/User';

@Injectable()
export class AppService {
  private logger = new Logger();
  getHello(): string {
    return 'Hello World!';
  }

  getDiary(): string {

    return 'list';
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

  async signUp(request): Promise<string> {
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
          return "Fail to signup";
        });
      this.logger.log(`Success to signup User: ${req.name}`);
      return "Success to signup";
    } else {
      this.logger.log("Same name is already exist!");
      return "Same name is already exist!";
    }
  }

  async signIn(request): Promise<string> {
    const req = request.body;

    const user = await getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.password = :password && user.name = :name", { password: req.password, name: req.name })
      .getOne();
    this.logger.log(`${request.method} : ${request.url} : ${req.name}`);
    return "login";
    //토큰 기능 추가
  }
}
