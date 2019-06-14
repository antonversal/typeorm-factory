import { getConnection } from 'typeorm';

export const clean = () => {
  const { manager } = getConnection();
  const names = ['comment', 'post'];
  return manager.query(names.map(name => `DELETE FROM ${name};`).join('\n'));
};
