import * as crypto from 'node:crypto';
import { Inject, Service } from 'typedi';
import { CRYPTO_KEY_LENGTH, CRYPTO_SECRET } from './env-conf';

@Service()
export class HashService {
  constructor(
    @Inject(CRYPTO_SECRET) private defaultSalt: string,
    @Inject(CRYPTO_KEY_LENGTH) private keyLength: number,
  ) {}

  genSalt(): string {
    return crypto.randomBytes(this.keyLength | 0).toString('hex');
  }

  genPassSalted(value: string, salt: string): string {
    if (!salt.length) {
      throw new Error('"Crypto Salt" é inválido');
    }
    return this.genHash(value + salt);
  }

  private genHash(value: string): string {
    return crypto.scryptSync(value, this.defaultSalt, 64).toString('base64');
  }
}
