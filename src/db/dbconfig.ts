import { DATABASE_URL } from '@core/env-conf';
import { User } from '@entities/user';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';

export const dataORM = new DataSource({
  type: 'postgres',
  entities: [User],
  synchronize: true,
});

export async function dbConfig() {
  dataORM.setOptions({
    url: Container.get(DATABASE_URL),
  });
  await dataORM.initialize();
}
