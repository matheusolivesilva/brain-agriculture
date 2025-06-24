import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { Producers } from './producers.entity';
import { Locations } from './locations.entity';
import { CropsPlanted } from './crops-planted.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Table({ tableName: 'properties' })
export class Properties extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @ForeignKey(() => Producers)
  @Column(DataType.UUID)
  producer_id: string;

  @ApiResponseProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
  name: string;

  @ApiResponseProperty()
  @Column({ type: DataType.DECIMAL, allowNull: false })
  total_area: number;

  @ApiResponseProperty()
  @Column({ type: DataType.DECIMAL, allowNull: false })
  arable_area: number;

  @ApiResponseProperty()
  @Column({ type: DataType.DECIMAL, allowNull: false })
  vegetation_area: number;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => Producers })
  @BelongsTo(() => Producers)
  producer: Producers;

  @ApiResponseProperty({ type: () => CropsPlanted })
  @HasMany(() => CropsPlanted)
  crops: CropsPlanted[];

  @ApiResponseProperty({ type: () => Locations })
  @HasOne(() => Locations)
  location: Locations;
}
