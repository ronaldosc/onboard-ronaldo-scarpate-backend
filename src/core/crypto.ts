import crypto from 'node:crypto';
import { Inject, Service } from 'typedi';
import { CRYPTO_KEY_LENGTH, CRYPTO_SECRET } from './env-conf';

@Service()
export class CryptoService {
  constructor(
    @Inject(CRYPTO_SECRET) private readonly defaultSalt: string,
    @Inject(CRYPTO_KEY_LENGTH) private readonly keyLength: number,
  ) {}

  generateSalt(): string {
    return crypto.randomBytes(this.keyLength ?? crypto.randomInt(1, 17)).toString('hex');
  }

  generateSaltedPass(passValue: string, salt: string): string {
    if (!passValue.length) {
      throw new Error(`'Crypto Salt' inválido`);
    }
    return this.generateHash(passValue + salt);
  }

  private generateHash(passPlusSalt: string): string {
    return crypto.scryptSync(passPlusSalt, this.defaultSalt ?? 'defaultSalt', 64).toString('base64');
  }
}
