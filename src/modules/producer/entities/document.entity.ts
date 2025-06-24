import { BadRequestException } from '@nestjs/common';
import { CleanDocument } from '../../../common/helpers/clean-document';
import { CNPJ } from '../../../common/validators/cnpj';
import { CPF } from '../../../common/validators/cpf';

export class Document {
  type: string;
  value: string;

  static create(value: string): Document {
    const document = new Document(value);
    value = CleanDocument.clean(value);
    const documentType = document.getDocumentType(value);

    document.type = documentType;

    if (document.type === 'cpf') {
      if (!CPF.isValid(value)) {
        throw new BadRequestException('Invalid CPF');
      }
    }

    if (document.type === 'cnpj') {
      if (!CNPJ.isValid(value)) {
        throw new BadRequestException('Invalid CNPJ');
      }
    }

    document.value = value;
    return document;
  }

  private constructor(value: string) {
    this.value = value;
  }

  /*
   * Seta o tipo do documento para saber se é CPF ou CNPJ
   */
  getDocumentType(value: string): string {
    switch (value.length) {
      case 11:
        return 'cpf';
      case 14:
        return 'cnpj';
      default:
        throw new BadRequestException('Invalid document type');
    }
  }
}
