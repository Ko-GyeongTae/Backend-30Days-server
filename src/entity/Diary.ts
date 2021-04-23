import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Post {

  @PrimaryGeneratedColumn('uuid')
  postUid: string;

  @ManyToOne(type => User, user => user.posts)
  user: User;

  @Column()
  title: string;

  @Column()
  content: string;
  
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  date: string;

}