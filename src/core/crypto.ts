import crypto from 'node:crypto';
import { Inject, Service } from 'typedi';
import { CRYPTO_KEY_LENGTH, CRYPTO_SECRET } from './env-conf';

@Service()
export class CryptoService {
  constructor(
    @Inject(CRYPTO_SECRET) private readonly cryptoSecret: string,
    @Inject(CRYPTO_KEY_LENGTH) private readonly keyLength: number,
  ) {}

  generateSalt(): string {
    return crypto.randomBytes(this.keyLength ?? crypto.randomInt(1, 17)).toString('hex');
  }

  generateHashedPass(passValue: string, salt: string): string {
    return crypto.scryptSync(passValue + salt, this.cryptoSecret ?? 'defaultSalt', 64).toString('base64');
  }
}
