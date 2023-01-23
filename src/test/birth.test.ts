import { birthValidator } from '@core/validators';
import { expect } from 'chai';
import { differenceInYears } from 'date-fns';

describe('Birthdate validation', () => {
  it('should return true for a valid birthdate', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 15);
    expect(birthValidator(date)).to.be.true;
  });
  it('should throw an error for a birthdate in the future', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    expect(() => birthValidator(date)).to.throw(`A data de nascimento '${date}' é posterior a data atual.`);
  });
  it('should return false for a birthdate less than 15 years ago', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 14);
    expect(birthValidator(date)).to.be.false;
  });
});




describe('Birthdate validation', () => {
  it('should return true for a valid birthdate', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 15);
    expect(birthValidator(date)).to.be.true;
  });
  it('should throw an error for a birthdate in the future', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    expect(() => birthValidator(date)).to.throw(`A data de nascimento '${date}' é posterior a data atual.`);
  });
  it('should return false for a birthdate less than 15 years ago', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 14);
    expect(birthValidator(date)).to.be.false;
  });
});



/////////////////////   retirar o de baixo
describe('differenceInYears', () => {
  it('should return the correct number of years between two dates', () => {
    const date1 = new Date('2000-01-01');
    const date2 = new Date('2010-01-01');
    expect(differenceInYears(date1, date2)).to.equal(10);
  });
  it('should return a negative value if the first date is later than the second', () => {
    const date1 = new Date('2010-01-01');
    const date2 = new Date('2000-01-01');
    expect(differenceInYears(date1, date2)).to.equal(-10);
  });
  it('should return zero if the dates are the same', () => {
    const date1 = new Date('2010-01-01');
    const date2 = new Date('2010-01-01');
    expect(differenceInYears(date1, date2)).to.equal(0);
  });
});


