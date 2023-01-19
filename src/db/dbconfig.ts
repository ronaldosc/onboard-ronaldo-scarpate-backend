import { DATABASE_URL, EnvConf } from '@core/env-conf';
import { User } from '@entities/user';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';

EnvConf.config();
const databaseURL = Container.get(DATABASE_URL);

export const dataORM = new DataSource({
  type: 'postgres',
  entities: [User],
  synchronize: true,
});

export async function dbConfig() {
  dataORM.setOptions({
    url: databaseURL,
  });
  await dataORM.initialize();
}
