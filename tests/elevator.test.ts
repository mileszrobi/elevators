import { Elevator, DONE } from "../src/elevator";

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

describe('Calculate the pickup time if the elevator is moving up with multiple stops', () => {
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

  test('source is before the first stop', () => {
    elevator.capacity = 0;
    expect(elevator.calculatePickupTime(1, 2)).toBe(-1);
  });
});

describe('Calculate pickup time if the elevator is still returning before starting moving up', () => {
  beforeEach(() => {
    elevator = new Elevator(10);
    elevator.floor = 5;
    elevator.serviceDirection = 1;
    elevator.program = {
      floor: 1,
      deltaCapacity: -1,
      next: {
        floor: 2,
        deltaCapacity: 1,
        next: DONE
      }
    };
  });

  test('the cost of the return journey is included', () => {
    expect(elevator.calculatePickupTime(2, 3)).toBe(5);
  });
});

describe('Calculate pickup time if the elevator is moving down', () => {
  beforeEach(() => {
    elevator = new Elevator(1);
    elevator.floor = 10;
    elevator.serviceDirection = -1;
    elevator.program = {
      floor: 8,
      deltaCapacity: -1,
      next: {
        floor: 5,
        deltaCapacity: 1,
        next: DONE
      }
    };
  });

  test('reject if the request is in the opposite direction', () => {
    expect(elevator.calculatePickupTime(2, 3)).toBe(-1);
  });

  test('source is before the first stop', () => {
    elevator.capacity = 0;
    expect(elevator.calculatePickupTime(9, 8)).toBe(-1);
  });

  test('source is at a stop with no capacity', () => {
    expect(elevator.calculatePickupTime(8, 7)).toBe(-1);
  });

  test('has capacity at source, but not for the entire trip', () => {
    expect(elevator.calculatePickupTime(9, 7)).toBe(-1);
  });
});
