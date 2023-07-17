import { Elevator } from "../src";

let elevator: Elevator;

describe('Travel cost for an elevator equals to the sum of getting to the "from" floor then to the "to" floor, if the elevator is idle', () => {
  beforeEach(() => {
    elevator = new Elevator(1);
  });

  test('moving one floor up from ground', () => {
    expect(elevator.travelCost(0, 1)).toBe(1);
  });

  test('picking up the passenger on the way up', () => {
    expect(elevator.travelCost(1, 2)).toBe(2);
  });

  test('passenger travels in the opposite direction', () => {
    expect(elevator.travelCost(2, 1)).toBe(3);
  });

  test('consider current floor', () => {
    elevator.onFloor = 5;
    expect(elevator.travelCost(6, 4)).toBe(3);
  });
});
