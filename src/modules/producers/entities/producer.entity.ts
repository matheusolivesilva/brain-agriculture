import { BadRequestException } from '@nestjs/common';
import { Document } from './document.entity';

export class Producer {
  constructor(
    public name: string,
    public document: Document,
  ) {
    this.name = name;
    this.document = document;
    this.isNameEmpty();
  }

  private isNameEmpty() {
    if (this.name.length === 0) {
      throw new BadRequestException('Producer name is empty');
    }
  }
}
