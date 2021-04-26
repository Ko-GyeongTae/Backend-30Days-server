import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Diary {

  @PrimaryGeneratedColumn('uuid')
  postUid: string;

  @ManyToOne(
    (type) => User,
    (user) => user.Diaries, {nullable: true, onDelete: 'CASCADE'}
  )
  user!: User;

  @Column()
  userUid: string;

  @Column()
  title: string;

  @Column()
  content: string;
  
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  date: string;

}