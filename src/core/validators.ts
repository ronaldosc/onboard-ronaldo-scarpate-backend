import { differenceInYears } from 'date-fns';

export const passValidator = (password: string): void => {
  const pattern: RegExp = /(?=\w*?\d)(?=\d*?\S)\w{6,}/g;

  if (!pattern.test(password)) {
    throw new Error(`A senha informada não é válida.`);
  }
  return;
};

export const birthValidator = (birthdate: string | Date): void | never => {
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
    return;
  } else if (dates.resultInYears < 0) {
    throw new Error(`A data informada '${birthdate}' é posterior a data atual.`);
  } else {
    throw new Error(`Para se cadastrar, necessita ter idade mínima de 15 (quinze) anos.`);
  }
};

export const mailValidator = (email: string): void => {
  const pattern: RegExp = /^(\w{1,}@\w{1,}\.(\w{3})(\.\w{2}){0,1})$/g;

  if (!email) {
    throw new Error(`Campo e-mail obrigatório.`);
  }

  if (!pattern.test(email)) {
    throw new Error(`O e-mail informado não é válido.`);
  }

  return;
};
