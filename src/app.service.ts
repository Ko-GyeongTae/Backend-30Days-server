import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Post } from './entity/Diary';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDiary(): string {

    return 'list';
  }

  async writeDiary(request) {
    const req = request.body
    const user = undefined;
    console.log(req);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({ title: req.title, content: req.content })
      .execute();
    
    return 'write';
  }
}
