import { CNPJ } from './cnpj';

describe('CNPJ', () => {
  describe('isValid', () => {
    it('should return true for a valid CNPJ', () => {
      const validCNPJ = '12.345.678/0001-95';
      expect(CNPJ.isValid(validCNPJ)).toBe(true);
    });

    it('should return false for an invalid CNPJ', () => {
      const invalidCNPJ = '12.345.678/0001-00';
      expect(CNPJ.isValid(invalidCNPJ)).toBe(false);
    });

    it('should return false for a CNPJ with repeated digits', () => {
      const repeatedCNPJ = '11.111.111/1111-11';
      expect(CNPJ.isValid(repeatedCNPJ)).toBe(false);
    });

    it('should return false for a CNPJ with incorrect length', () => {
      const shortCNPJ = '12.345.678/0001';
      expect(CNPJ.isValid(shortCNPJ)).toBe(false);

      const longCNPJ = '12.345.678/0001-950';
      expect(CNPJ.isValid(longCNPJ)).toBe(false);
    });

    it('should return false for a CNPJ with non-numeric characters', () => {
      const invalidCNPJ = '12a.345b.678/0001-cd';
      expect(CNPJ.isValid(invalidCNPJ)).toBe(false);
    });

    it('should return false for a CNPJ with spaces', () => {
      const cnpjWithSpaces = ' 12.345.678/0001-95 ';
      expect(CNPJ.isValid(cnpjWithSpaces)).toBe(true);
    });

    it('should return true for a valid CNPJ without formatting (no dots, slashes, or dashes)', () => {
      const validCNPJ = '12345678000195';
      expect(CNPJ.isValid(validCNPJ)).toBe(true);
    });
  });
});
