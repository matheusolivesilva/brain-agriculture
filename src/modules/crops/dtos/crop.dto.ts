import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CropDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: 'fdb0b321-7a35-4cf6-8349-211cb23902ee',
    description: 'Farm ID in UUID format.',
    type: String,
  })
  propertyId: string;

  @IsNumber()
  @ApiProperty({
    example: '2025',
    description: 'Year of the harvest.',
    type: Number,
  })
  @IsNotEmpty()
  harvestYear: number;

  @IsString()
  @ApiProperty({
    example: 'Coffe',
    description: 'Type of crop.',
    type: String,
  })
  @IsNotEmpty()
  type: string;
}
