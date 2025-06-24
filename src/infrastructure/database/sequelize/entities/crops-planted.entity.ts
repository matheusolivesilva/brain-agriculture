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
import { Harvests } from './harvests.entity';
import { Properties } from './properties.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

@Table({ tableName: 'crops_planted' })
export class CropsPlanted extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @ForeignKey(() => Harvests)
  @Column({ type: DataType.UUID, allowNull: false })
  harvest_id: string;

  @ApiResponseProperty()
  @ForeignKey(() => Properties)
  @Column({ type: DataType.UUID, allowNull: true })
  property_id: string;

  @ApiResponseProperty()
  @Column({ type: DataType.TEXT, allowNull: false })
  type: string;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => Harvests })
  @BelongsTo(() => Harvests)
  harvest: Harvests;

  @ApiResponseProperty({ type: () => Properties })
  @BelongsTo(() => Properties)
  property: Properties;
}
