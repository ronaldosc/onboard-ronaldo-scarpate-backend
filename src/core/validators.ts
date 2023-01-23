import { differenceInYears } from 'date-fns';

export const passValidator = (password: string): unknown => {
  const pattern: RegExp = /(?=\w*?\d)(?=\d*?\S)\w{6,}/gm;

  return pattern.test(password);
};

export const birthValidator = (birthdate: string | Date): boolean => {
  const isBefore = new Date(birthdate).getTime();
  const today = Date.now();
  if (isBefore > today) {
    throw new Error(`A data de nascimento '${birthdate}' é posterior a data atual.`);
  }
  if (differenceInYears(today, isBefore) >= 15) {
    return true;
  }
  return false;
};
