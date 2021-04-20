import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDiary(): string {
    return 'list';
  }

  writeDiary(): string {
    return 'write';
  }
}
