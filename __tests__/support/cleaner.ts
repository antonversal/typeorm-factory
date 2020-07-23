import { getConnection } from 'typeorm';

export const clean = (connectionName = 'default') => {
  const { manager } = getConnection(connectionName);
  const names = ['comment', 'post', 'author'];
  return manager.query(names.map(name => `DELETE FROM ${name};`).join('\n'));
};
