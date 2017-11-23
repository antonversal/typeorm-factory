import { EntityManager, getConnection } from "typeorm";

const clearTable = (manager: EntityManager, name: string) =>
  manager
    .createQueryBuilder()
    .delete()
    .from(name)
    .execute();

export const clean = async () => {
  const conn = getConnection();
  await conn.transaction(async (manager) => {
    await clearTable(manager, "post");
    await clearTable(manager, "comment");
  });
};
