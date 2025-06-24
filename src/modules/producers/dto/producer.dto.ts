import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProducerDto {
  @IsString()
  @ApiProperty({
    example: '777.999.555-99',
    description: 'CPF or CNPJ.',
    type: String,
  })
  @IsNotEmpty()
  document: string;

  @IsString()
  @ApiProperty({
    example: 'John Doe Farmer',
    description: 'Owner name or company name.',
    type: String,
  })
  @IsNotEmpty()
  name: string;
}
