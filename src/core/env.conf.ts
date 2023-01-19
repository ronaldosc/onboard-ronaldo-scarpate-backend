import { env } from 'node:process';
import { Container, Token } from 'typedi';

export const HOST = new Token<string>('HOST');
export const PORT = new Token<number>('PORT')
export const DATABASE_URL = new Token<string>('DATABASE_URL');

export namespace EnvConf {
  export function config() {
    require('dotenv').config();
    Container.set(PORT, +env.PORT!);
    Container.set(HOST, env.HOST);
    Container.set(DATABASE_URL, env.DATABASE_URL);
  }
}
