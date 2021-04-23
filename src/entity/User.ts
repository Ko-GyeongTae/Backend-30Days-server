import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Post } from "./Diary";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(
    (type) => Post, 
    (post) => post.user
      
  )
  posts!: Post[];
}