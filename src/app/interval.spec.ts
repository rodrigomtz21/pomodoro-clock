import { Interval } from './interval';

describe('Interval', () => {
  it('should create an instance', () => {
    expect(new Interval(
      "interval11",
      "Interval 1",
      5,
      0,
      false,
      true
    )).toBeTruthy();
  });
});
