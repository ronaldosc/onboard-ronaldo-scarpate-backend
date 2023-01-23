import { differenceInYears } from 'date-fns';

export const passValidator = (password: string): unknown => {
  const pattern: RegExp = /(?=\w*?\d)(?=\d*?\S)\w{6,}/gm;

  return pattern.test(password);
};

export const birthValidator = (birthdate: string | Date): boolean => {
  const dates = {
    isBefore: new Date(birthdate).getTime(),
    today: Date.now(),
    get resultInYears(): number {
      return differenceInYears(this.today, this.isBefore);
    },
  };

  if (!dates.isBefore) {
    throw new Error(`A data de nascimento '${birthdate}' não é válida.`);
  }

  if (dates.resultInYears >= 15) {
    return true;
  } else if (dates.resultInYears < 0) {
    throw new Error(`A data informada '${birthdate}' é posterior a data atual.`);
  } else {
    return false;
  }
};
