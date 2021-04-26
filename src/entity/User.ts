import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Diary } from "./Diary";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(
    (type) => Diary, 
    (Diary) => Diary.user
      
  )
  Diaries!: Diary[];
}