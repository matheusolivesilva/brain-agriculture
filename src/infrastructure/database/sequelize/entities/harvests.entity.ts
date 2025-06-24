import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { CropsPlanted } from './crops-planted.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
@Table({ tableName: 'harvests' })
export class Harvests extends Model {
  @ApiResponseProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiResponseProperty()
  @Column({ type: DataType.DECIMAL, allowNull: false, unique: true })
  year: number;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @ApiResponseProperty()
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @ApiResponseProperty({ type: () => CropsPlanted })
  @HasMany(() => CropsPlanted)
  crops: CropsPlanted[];
}
