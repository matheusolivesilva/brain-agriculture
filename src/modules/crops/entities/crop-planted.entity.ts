import { Harvest } from './harvest.entity';

export class CropPlanted {
  constructor(
    public type: string,
    public harvest: Harvest,
  ) {}
}
