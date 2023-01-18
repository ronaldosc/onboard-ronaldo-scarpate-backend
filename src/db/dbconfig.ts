import Container from 'typedi';
import { DataSource } from 'typeorm';
import { DB_DATABASE, DB_HOST, DB_PASS, DB_PORT, DB_SCHEME, DB_USER, EnvConf } from '../core/env.conf';
import { User } from './entities/user';

EnvConf.config();
const dbScheme = Container.get(DB_SCHEME);
const dbUser = Container.get(DB_USER);
const dbPass = Container.get(DB_PASS);
const dbHost = Container.get(DB_HOST);
const dbPort: number = Container.get(DB_PORT) | 0;
const dbDatabase = Container.get(DB_DATABASE);

const databaseURI = `${dbScheme}://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbDatabase}`;

export const dataORM = new DataSource({
  type: 'postgres',
  entities: [User],
  synchronize: true,
});

export async function dbConfig() {
  dataORM.setOptions({ url: databaseURI });
  await dataORM.initialize();
}
