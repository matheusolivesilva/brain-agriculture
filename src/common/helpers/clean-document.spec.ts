import { CleanDocument } from './clean-document';

describe('CleanDocument', () => {
  describe('clean', () => {
    it('should remove all non-numeric characters', () => {
      const input = '123.456.789-00';
      const result = CleanDocument.clean(input);
      expect(result).toBe('12345678900');
    });

    it('should return the same string if it only contains numbers', () => {
      const input = '98765432100';
      const result = CleanDocument.clean(input);
      expect(result).toBe('98765432100');
    });

    it('should return an empty string if input is only non-numeric', () => {
      const input = '.-()/ abc';
      const result = CleanDocument.clean(input);
      expect(result).toBe('');
    });

    it('should handle empty input', () => {
      const input = '';
      const result = CleanDocument.clean(input);
      expect(result).toBe('');
    });
  });
});
