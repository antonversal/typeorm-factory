import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column("varchar")
  public text: string;

  @Column("varchar", { nullable: false })
  public authorName: string;

  @ManyToOne(() => Post, (post) => post.comments)
  public post: Post;
}
