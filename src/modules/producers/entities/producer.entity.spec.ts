import { Document } from './document.entity';
import { BadRequestException } from '@nestjs/common';
import { Producer } from './producer.entity';

describe('Producer', () => {
  let mockDocument: Document;

  beforeEach(() => {
    mockDocument = {
      type: 'cpf',
      value: '12345678901',
    } as Document;
  });

  it('should create a Producer with valid name and document', () => {
    const producer = new Producer('João Silva', mockDocument);

    expect(producer).toBeDefined();
    expect(producer.name).toBe('João Silva');
    expect(producer.document).toBe(mockDocument);
  });

  it('should throw BadRequestException if name is empty', () => {
    expect(() => new Producer('', mockDocument)).toThrow(BadRequestException);
    expect(() => new Producer('', mockDocument)).toThrow(
      'Producer name is empty',
    );
  });
});
