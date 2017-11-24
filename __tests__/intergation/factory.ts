import { createConnection } from "typeorm";
import { Factory } from "../../src/Factory";
import { Author } from "../fixtures/entity/Author";
import { Comment } from "../fixtures/entity/Comment";
import { Post, PostType } from "../fixtures/entity/Post";
import { clean } from "../support/cleaner";

beforeAll(async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "typeorm-factory-test",
    synchronize: true,
    entities: [Post, Comment, Author],
  });
  await clean();
});

afterEach(() => clean);

describe("Factory Test", () => {
  let PostFactory: Factory<Post>;
  let CommentFactory: Factory<Comment>;
  let AuthorFactory: Factory<Author>;
  let MostLikedPost: Factory<Post>;

  beforeEach(() => {
    CommentFactory = new Factory(Comment)
      .sequence("text", (i) => `text ${i}`)
      .attr("authorName", "John Doe");

    AuthorFactory = new Factory(Author)
      .sequence("firstName", (i) => `John ${i}`)
      .sequence("lastName", (i) => `Doe ${i}`);

    PostFactory = new Factory(Post)
      .sequence("title", (i) => `title ${i}`)
      .sequence("text", (i) => `text ${i}`)
      .attr("likesCount", 10)
      .attr("postType", PostType.TEXT)
      .assocMany("comments", CommentFactory, 2)
      .assocOne("author", AuthorFactory);

    MostLikedPost = PostFactory.attr("likesCount", 10000);
  });

  describe("build", () => {
    describe("sequence", () => {
      it("returns next number", () => {
        expect(PostFactory.build().title).toEqual("title 1");
        expect(PostFactory.build().title).toEqual("title 2");
        expect(PostFactory.build().title).toEqual("title 3");
      });

      it("returns next number across all types ", () => {
        expect(PostFactory.build().title).toEqual("title 1");
        expect(PostFactory.build().title).toEqual("title 2");
        expect(MostLikedPost.build().title).toEqual("title 3");
      });
    });

    describe("attr", () => {
      it("returns attribute value", () => {
        expect(PostFactory.build().likesCount).toEqual(10);
        expect(MostLikedPost.build().likesCount).toEqual(10000);
        expect(PostFactory.build().postType).toEqual(PostType.TEXT);
      });
    });
  });

  describe("create", () => {
    it("creates an record in db", async () => {
      const createObject = await PostFactory.create();
      expect(createObject.id).toBeDefined();
    });
  });

  describe("createList", () => {
    it("creates an array of object", async () => {
      const createdObjects = await PostFactory.createList(3);
      expect(createdObjects.length).toEqual(3);
    });
  });

  describe("buildList", () => {
    it("builds an array of objects", async () => {
      const createdObjects = await PostFactory.buildList(3);
      expect(createdObjects.length).toEqual(3);
    });
  });

  describe("assocMany", () => {
    it("builds association", () => {
      const object = PostFactory.build();
      expect(object.comments.length).toEqual(2);
      expect(object.comments[0]).toBeInstanceOf(Comment);
    });

    it("creates association", async () => {
      const object = await PostFactory.create();
      expect(object.comments[0].id).toBeDefined();
    });
  });

  describe("assocOne", () => {
    it("builds association", () => {
      const object = PostFactory.build();
      expect(object.author).toBeInstanceOf(Author);
    });

    it("creates association", async () => {
      const object = await PostFactory.create();
      expect(object.author.id).toBeDefined();
    });
  });

  it("accepts attributes", () => {
    const object = PostFactory.build({ title: "new title" });
    expect(object.title).toEqual("new title");
  });
});
