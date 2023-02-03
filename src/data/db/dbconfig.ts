import { DATABASE_URL } from '@core';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';
import { User } from './entities';

const dataORMOpts: DataSource = new DataSource({
  type: 'postgres',
  entities: [User],
  synchronize: true,
});

export class Database {
  static readonly connection: DataSource = dataORMOpts;
  private db: DataSource = Database.connection;
  private url: string = Container.get(DATABASE_URL);
  /**
   * @param [number] timeout connection in milliseconds
   * (default: 2000)
   */
  async init(isTesting?: boolean): Promise<void> {
    this.db.setOptions({
      connectionTimeout: isTesting ? 1500 : undefined,
      applicationName: 'NodeJS',
      url: this.url,
    });
    await this.db.initialize();
  }
}
