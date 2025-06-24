import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Properties } from './properties.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Table({ tableName: 'producers' })
export class Producers extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
  name: string;

  @ApiResponseProperty()
  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  document: string;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => Properties })
  @HasMany(() => Properties)
  properties: Properties[];
}
