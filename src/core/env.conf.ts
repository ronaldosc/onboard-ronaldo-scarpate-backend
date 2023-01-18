// import * as dotenv from "dotenv"
import { env } from 'node:process';
import { Container, Token } from 'typedi';

export const HOST = new Token<string>('HOST');
export const PORT = new Token<number>('PORT')

export const DB_SCHEME = new Token<string>('DB_SCHEME');
export const DB_USER = new Token<string>('DB_USER');
export const DB_PASS = new Token<string>('DB_PASS');
export const DB_HOST = new Token<string>('DB_HOST');
export const DB_PORT = new Token<number>('DB_PORT');
export const DB_DATABASE = new Token<string>('DB_DATABASE');


export namespace EnvConf {
  export function config() {
    require('dotenv').config();
    Container.set(PORT, +env.PORT!);
    Container.set(HOST, env.HOST);

    Container.set(DB_SCHEME, env.DB_SCHEME);
    Container.set(DB_USER, env.DB_USER);
    Container.set(DB_PASS, env.DB_PASS);
    Container.set(DB_HOST, env.DB_HOST);
    Container.set(DB_PORT, +env.DB_PORT!);
    Container.set(DB_DATABASE, env.DB_DATABASE);
  }
}
