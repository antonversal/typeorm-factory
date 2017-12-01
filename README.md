# typeorm-factory

[![CircleCI](https://circleci.com/gh/antonversal/typeorm-factory/tree/master.svg?style=svg)](https://circleci.com/gh/antonversal/typeorm-factory/tree/master)

`typeorm-factory` is a factory library for [typeorm](https://github.com/typeorm/typeorm). It supports all databases that uses typeorm's `Repository`, so it doesn't support `MongoDB`, a pull request are welcome.

## Installation

Node.js:

```bash
npm install --save-dev typeorm-factory
# or
yarn add --dev typeorm-factory
```

## Usage

```typescript
# be sure a typeorm connection is opened before create a factory
import { Factory } from "../../src/Factory";

const CommentFactory = new Factory(Comment)
  .sequence("text", (i) => `text ${i}`)
  .attr("authorName", "John Doe");

const AuthorFactory = new Factory(Author)
  .sequence("firstName", (i) => `John ${i}`)
  .sequence("lastName", (i) => `Doe ${i}`);

const PostFactory = new Factory(Post)
  .sequence("title", (i) => `title ${i}`)
  .sequence("text", (i) => `text ${i}`)
  .attr("likesCount", 10)
  .assocMany("comments", CommentFactory, 2)
  .assocOne("author", AuthorFactory);

const build = async () => {
  console.log(await PostFactory.build())
  console.log(await PostFactory.build({ text: 'Foo' }))
  console.log(await PostFactory.buildList(10))

  console.log(await PostFactory.create({ author: AuthorFactory.create() }))
  console.log(await PostFactory.createList(1))
}

build()
```

