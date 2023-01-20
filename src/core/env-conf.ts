import { env } from 'node:process';
import { Container, Token } from 'typedi';

export const HOST = new Token<string>('HOST');
export const PORT = new Token<number>('PORT');
export const DATABASE_URL = new Token<string>('DATABASE_URL');
export const CRYPTO_KEY_LENGTH = new Token<number>('CRYPTO_KEY_LENGTH');
export const CRYPTO_SECRET = new Token<string>('CRYPTO_SECRET');

export namespace EnvConf {
  export function config() {
    require('dotenv').config();
    Container.set(HOST, env.HOST);
    Container.set(PORT, +env.PORT!);
    Container.set(DATABASE_URL, env.DATABASE_URL);
    Container.set(CRYPTO_KEY_LENGTH, +env.CRYPTO_KEY_LENGTH!);
    Container.set(CRYPTO_SECRET, env.CRYPTO_SECRET);
  }
}
