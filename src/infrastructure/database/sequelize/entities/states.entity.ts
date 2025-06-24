import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Cities } from './cities.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Table({ tableName: 'states' })
export class States extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  state: string;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => Cities })
  @HasMany(() => Cities)
  cities: Cities[];
}
