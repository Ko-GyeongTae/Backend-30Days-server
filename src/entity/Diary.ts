import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Post {

  @PrimaryGeneratedColumn('increment')
  num: number;

  @Column({ nullable: true })
  userUid: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  date: string;
}