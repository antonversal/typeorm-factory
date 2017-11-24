import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./Author";
import { Comment } from "./Comment";

export enum PostType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column("varchar")
  public title: string;

  @Column("varchar")
  public text: string;

  @Column("int", { nullable: false })
  public likesCount: number;

  @Column("varchar", { nullable: false })
  public postType: PostType;

  @OneToMany(() => Comment, (comment) => comment.post)
  public comments: Comment[];

  @ManyToOne(() => Author, (author) => author.posts)
  public author: Author;
}
