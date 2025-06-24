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
} from 'sequelize-typescript';
import { States } from './states.entity';
import { Locations } from './locations.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Table({ tableName: 'cities' })
export class Cities extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @ForeignKey(() => States)
  @Column({ type: DataType.UUID, allowNull: false })
  state_id: string;

  @ApiResponseProperty()
  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  city: string;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => States })
  @BelongsTo(() => States)
  state: States;

  @ApiResponseProperty({ type: () => Locations })
  @HasMany(() => Locations)
  locations: Locations[];
}
