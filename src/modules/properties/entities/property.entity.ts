import { Location } from './location.entity';

export class Property {
  constructor(
    public name: string,
    public totalArea: number,
    public arableArea: number,
    public vegetationArea: number,
    public location: Location,
  ) {}

  isTotalAreaValid() {
    return this.calculateArea() <= this.totalArea;
  }

  private calculateArea(): number {
    return this.arableArea + this.vegetationArea;
  }
}
