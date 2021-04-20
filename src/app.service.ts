import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Post } from './entity/Diary';
import { User } from './entity/User';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDiary(): string {

    return 'list';
  }

  async writeDiary(request): Promise<string> {
    const req = request.body;
    const token = request.header;
    console.log(req);
    console.log(token);
    
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({ title: req.title, content: req.content })
      .execute()
      .catch(Error => {
        return "Fail to write Diary";
      });
    return 'Success to write Diary';
  }

  async signUp(request): Promise<string> {
    const req = request.body;
    console.log(req);

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ name: req.name, password: req.password })
      .execute()
      .catch(Error => {
        return "Fail to signup";
      });
    return "Success to signup";
  }
}
