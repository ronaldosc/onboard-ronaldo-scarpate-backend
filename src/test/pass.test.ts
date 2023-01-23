import { passValidator } from '@core/validators';
import { expect } from 'chai';

describe('Password validation', () => {
  it('should return true for a valid password', () => {
    expect(passValidator('p@ssw0rd')).to.be.true;
  });
  it('should return false for a password with less than 6 characters', () => {
    expect(passValidator('pass')).to.be.false;
  });
  it('should return false for a password without a special character', () => {
    expect(passValidator('password')).to.be.false;
  });
  it('should return false for a password without a number', () => {
    expect(passValidator('passw@rd')).to.be.true;
  });
});
