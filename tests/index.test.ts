import { Elevator } from "../src";

let elevator: Elevator;

describe('The pickup time for an elevator equals to steps necessary to get to the "from" floor, if the elevator is idle', () => {
  beforeEach(() => {
    elevator = new Elevator(1);
  });

  test('moving one floor up from ground', () => {
    expect(elevator.pickupTime(0, 1)).toBe(0);
  });

  test('picking up the passenger on the way up', () => {
    expect(elevator.pickupTime(1, 2)).toBe(1);
  });

  test('consider current floor', () => {
    elevator.onFloor = 5;
    expect(elevator.pickupTime(6, 4)).toBe(1);
  });
});
