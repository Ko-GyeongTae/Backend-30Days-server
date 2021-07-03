import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import { createConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser'; 
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  await createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "diary",
    synchronize: true,
    entities: [
      __dirname + "/entity/*.{js,ts}" //Entity 경로 설정
    ]
  }).then(() => { 
    console.log("Connect to DB successfullly!") 
  })
  .catch(error => console.log(error));
  await app.listen(5000);
}
bootstrap();
