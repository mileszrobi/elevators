import { Elevator, DONE } from "../src";

let elevator: Elevator;

describe('The pickup time for an elevator equals to steps necessary to get to the "from" floor, if the elevator is idle', () => {
  beforeEach(() => {
    elevator = new Elevator(1);
  });

  test('moving one floor up from ground', () => {
    expect(elevator.calculatePickupTime(0, 1)).toBe(0);
  });

  test('picking up the passenger on the way up', () => {
    expect(elevator.calculatePickupTime(1, 2)).toBe(1);
  });

  test('consider current floor', () => {
    elevator.floor = 5;
    expect(elevator.calculatePickupTime(6, 4)).toBe(1);
  });
});

describe('If the elevator currently does not have capacity', () => {
  beforeEach(() => {
    elevator = new Elevator(1);
    elevator.capacity = 0;
    elevator.serviceDirection = 1;
    elevator.program = {
      floor: 5,
      deltaCapacity: 1,
      next: DONE,
    };
  });

  test('source is before the first stop', () => {
    expect(elevator.calculatePickupTime(1, 2)).toBe(-1);
  })
});

describe('If the elevator is moving up, and has no capacity for the request', () => {
  beforeEach(() => {
    elevator = new Elevator(1);
    elevator.serviceDirection = 1;
    elevator.program = {
      floor: 2,
      deltaCapacity: -1,
      next: {
        floor: 4,
        deltaCapacity: 1,
        next: DONE
      },
    };
  });

  test('source is at a stop with no capacity', () => {
    expect(elevator.calculatePickupTime(2, 3)).toBe(-1);
  });

  test('source is between current stops with no capacity', () => {
    expect(elevator.calculatePickupTime(3, 4)).toBe(-1);
  });

  test('has capacity at source, but not for the entire trip', () => {
    expect(elevator.calculatePickupTime(1, 3)).toBe(-1);
  });
});
