import { DATABASE_URL } from '@core';
import { User } from '@entities';
import { isTest } from 'test';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';

const dataORMOpts: DataSource = new DataSource({
  type: 'postgres',
  entities: [User],
  synchronize: true,
});

export class Database {
  static readonly dataORM: DataSource = dataORMOpts;
  protected db: DataSource;
  private url: string;

  constructor() {
    this.db = Database.dataORM;
    this.url = Container.get(DATABASE_URL);
  }

  async init(): Promise<void> {
    this.db.setOptions({
      connectionTimeout: isTest ? 2000 : undefined,
      applicationName: 'NodeJS',
      url: this.url,
    });
    await this.db.initialize();
  }
}
