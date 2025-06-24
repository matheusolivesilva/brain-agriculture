export class CPF {
  static isValid(cpf: string) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
      return false;
    }
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    function calculateFirstDigit(cpf: string): number {
      let sum = 0;
      let weight = 10;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * weight--;
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    }

    function calculateSecondDigit(cpf: string): number {
      let sum = 0;
      let weight = 11;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * weight--;
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    }

    const firstDigitCalculated = calculateFirstDigit(cpf);
    const secondDigitCalculated = calculateSecondDigit(cpf);

    if (
      parseInt(cpf[9]) !== firstDigitCalculated ||
      parseInt(cpf[10]) !== secondDigitCalculated
    ) {
      return false;
    }

    return true;
  }
}
