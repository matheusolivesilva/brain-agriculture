export class CNPJ {
  static isValid(cnpj: string) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) {
      return false;
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    function calculateFirstDigit(cnpj: string): number {
      let sum = 0;
      const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj[i]) * weights[i];
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    }

    function calculateSecondDigit(cnpj: string): number {
      let sum = 0;
      const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj[i]) * weights[i];
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    }

    const firstDigitCalculated = calculateFirstDigit(cnpj);
    const secondDigitCalculated = calculateSecondDigit(cnpj);

    if (
      parseInt(cnpj[12]) !== firstDigitCalculated ||
      parseInt(cnpj[13]) !== secondDigitCalculated
    ) {
      return false;
    }

    return true;
  }
}
