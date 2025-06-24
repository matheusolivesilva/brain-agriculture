import { BadRequestException } from '@nestjs/common';
import { CPF } from '../../../common/validators/cpf';
import { CNPJ } from '../../../common/validators/cnpj';
import { Document } from './document.entity';
import { CleanDocument } from '../../../common/helpers/clean-document';

jest.mock('./../../../common/helpers/clean-document.ts');
jest.mock('./../../../common/validators/cpf');
jest.mock('./../../../common/validators/cnpj');

describe('Document', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a valid CPF document', () => {
    (CleanDocument.clean as jest.Mock).mockReturnValue('12345678901');
    (CPF.isValid as jest.Mock).mockReturnValue(true);

    const result = Document.create('123.456.789-01');

    expect(result).toEqual({
      type: 'cpf',
      value: '12345678901',
    });

    expect(CleanDocument.clean).toHaveBeenCalledWith('123.456.789-01');
    expect(CPF.isValid).toHaveBeenCalledWith('12345678901');
  });

  it('should throw BadRequestException for invalid CPF', () => {
    (CleanDocument.clean as jest.Mock).mockReturnValue('12345678901');
    (CPF.isValid as jest.Mock).mockReturnValue(false);

    expect(() => Document.create('123.456.789-01')).toThrow(
      BadRequestException,
    );
    expect(CPF.isValid).toHaveBeenCalledWith('12345678901');
  });

  it('should create a valid CNPJ document', () => {
    (CleanDocument.clean as jest.Mock).mockReturnValue('12345678000199');
    (CNPJ.isValid as jest.Mock).mockReturnValue(true);

    const result = Document.create('12.345.678/0001-99');

    expect(result).toEqual({
      type: 'cnpj',
      value: '12345678000199',
    });

    expect(CleanDocument.clean).toHaveBeenCalledWith('12.345.678/0001-99');
    expect(CNPJ.isValid).toHaveBeenCalledWith('12345678000199');
  });

  it('should throw BadRequestException for invalid CNPJ', () => {
    (CleanDocument.clean as jest.Mock).mockReturnValue('12345678000199');
    (CNPJ.isValid as jest.Mock).mockReturnValue(false);

    expect(() => Document.create('12.345.678/0001-99')).toThrow(
      BadRequestException,
    );
    expect(CNPJ.isValid).toHaveBeenCalledWith('12345678000199');
  });

  it('should throw BadRequestException for invalid document length', () => {
    (CleanDocument.clean as jest.Mock).mockReturnValue('123');

    expect(() => Document.create('123')).toThrow(BadRequestException);
  });
});
