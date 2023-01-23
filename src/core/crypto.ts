import crypto from 'node:crypto';
import { Inject, Service } from 'typedi';
import { CRYPTO_KEY_LENGTH, CRYPTO_SECRET } from './env-conf';

@Service()
export class CryptoService {
  constructor(
    @Inject(CRYPTO_SECRET) private defaultSalt: string,
    @Inject(CRYPTO_KEY_LENGTH) private keyLength: number,
  ) {}

  generateSalt(): string {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  generateSaltedPass(value: string, salt: string): string {
    if (!salt.length) {
      throw new Error('"Crypto Salt" é inválido');
    }
    return this.generateHash(value + salt);
  }

  private generateHash(value: string): string {
    return crypto.scryptSync(value, this.defaultSalt ?? 'defaultSalt', 64).toString('base64');
  }
}
