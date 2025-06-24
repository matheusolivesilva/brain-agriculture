import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsString()
  @ApiProperty({
    example: 'Los Angeles',
    description: 'City name.',
    type: String,
  })
  city: string;

  @IsString()
  @ApiProperty({
    example: 'California',
    description: 'State name.',
    type: String,
  })
  state: string;
}

export class PropertyDto {
  @IsString()
  @ApiProperty({
    example: '060.783.260-66',
    description: 'Farm or producer document.',
    type: String,
  })
  producerDocument: string;

  @IsString()
  @ApiProperty({
    example: 'John Doe Farm',
    description: 'Farm or property name.',
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @ApiProperty({
    example: 600,
    description: 'Total area of the property.',
    type: Number,
  })
  @IsNotEmpty()
  totalArea: number;

  @IsNumber()
  @ApiProperty({
    example: 300,
    description: 'Arable area of the property.',
    type: Number,
  })
  @IsNotEmpty()
  arableArea: number;

  @IsNumber()
  @ApiProperty({
    example: 300,
    description: 'Vegetation area of the property.',
    type: Number,
  })
  @IsNotEmpty()
  vegetationArea: number;

  @ApiProperty({ description: 'Property location', type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;
}
