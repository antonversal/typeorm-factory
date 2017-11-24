import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Author {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column("varchar")
  public firstName: string;

  @Column("varchar")
  public lastName: string;

  @OneToMany(() => Post, (post) => post.author)
  public posts: Post[];
}
