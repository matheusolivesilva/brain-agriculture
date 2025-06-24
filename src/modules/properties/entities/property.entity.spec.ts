import { Property } from './property.entity';
import { Location } from './location.entity';

describe('Property', () => {
  const mockLocation: Location = {
    state: 'SP',
    city: 'São Paulo',
  };

  it('should create a Property instance correctly', () => {
    const property = new Property('Farm A', 100, 60, 30, mockLocation);

    expect(property.name).toBe('Farm A');
    expect(property.totalArea).toBe(100);
    expect(property.arableArea).toBe(60);
    expect(property.vegetationArea).toBe(30);
    expect(property.location).toEqual(mockLocation);
  });

  it('should return true if arableArea + vegetationArea <= totalArea', () => {
    const property = new Property('Farm B', 100, 60, 40, mockLocation);
    expect(property.isTotalAreaValid()).toBe(true);
  });

  it('should return false if arableArea + vegetationArea > totalArea', () => {
    const property = new Property('Farm C', 100, 70, 40, mockLocation); // 110 > 100
    expect(property.isTotalAreaValid()).toBe(false);
  });
});
