import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Properties } from './properties.entity';
import { Cities } from './cities.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Table({ tableName: 'locations' })
export class Locations extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @ForeignKey(() => Properties)
  @Column({ type: DataType.UUID, allowNull: false })
  property_id: string;

  @ApiResponseProperty()
  @ForeignKey(() => Cities)
  @Column({ type: DataType.UUID, allowNull: false })
  city_id: string;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => Properties })
  @BelongsTo(() => Properties)
  property: Properties;

  @ApiResponseProperty({ type: () => Cities })
  @BelongsTo(() => Cities)
  city: Cities;
}
