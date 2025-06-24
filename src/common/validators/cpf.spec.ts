import { CPF } from './cpf';

describe('CPF', () => {
  describe('isValid', () => {
    it('should return true for a valid CPF', () => {
      const validCPF = '123.456.789-09';
      expect(CPF.isValid(validCPF)).toBe(true);
    });

    it('should return false for an invalid CPF', () => {
      const invalidCPF = '123.456.789-00';
      expect(CPF.isValid(invalidCPF)).toBe(false);
    });

    it('should return false for a CPF with repeated digits', () => {
      const repeatedCPF = '111.111.111-11';
      expect(CPF.isValid(repeatedCPF)).toBe(false);
    });

    it('should return false for a CPF with incorrect length', () => {
      const shortCPF = '123.456.789';
      expect(CPF.isValid(shortCPF)).toBe(false);

      const longCPF = '123.456.789-123';
      expect(CPF.isValid(longCPF)).toBe(false);
    });

    it('should return false for a CPF with non-numeric characters', () => {
      const invalidCPF = '123a.456b.789c-00';
      expect(CPF.isValid(invalidCPF)).toBe(false);
    });

    it('should return false for a CPF with spaces before or after the number', () => {
      const cpfWithSpaces = ' 123.456.789-09 ';
      expect(CPF.isValid(cpfWithSpaces)).toBe(true);
    });

    it('should return true for a valid CPF without formatting (no dots, dashes, or spaces)', () => {
      const validCPF = '12345678909';
      expect(CPF.isValid(validCPF)).toBe(true);
    });

    it('should return false for a CPF with only zeros', () => {
      const zeroCPF = '000.000.000-00';
      expect(CPF.isValid(zeroCPF)).toBe(false);
    });
  });
});
