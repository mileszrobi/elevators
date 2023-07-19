import { Elevator } from "../src/elevator";

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
        next: null
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
        next: null
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
        next: null
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


describe('Insert a new stop into the program - idle elevator', () => {
  beforeEach(() => {
    elevator = new Elevator(10);
  });

  test('idle elevator', () => {
    elevator.insertStop(1, -1);
    expect(elevator.program).toEqual({
      floor: 1,
      deltaCapacity: -1,
      next: null
    });
  });
});

describe('Insert a new stop into the program - elevator moving up', () => {
  beforeEach(() => {
    elevator = new Elevator(10);
    elevator.program = {
      floor: 3,
      deltaCapacity: -1,
      next: {
        floor: 5,
        deltaCapacity: 1,
        next: null
      }
    };
  });

  test('elevator already stops on requested floor - capacity number adjusted', () => {
    elevator.insertStop(3, -1);
    expect(elevator.program).toEqual({
      floor: 3,
      deltaCapacity: -2,
      next: {
        floor: 5,
        deltaCapacity: 1,
        next: null
      }
    });
  });

  test('insert before first stop', () => {
    elevator.insertStop(2, 5);
    expect(elevator.program).toEqual({
      floor: 2,
      deltaCapacity: 5,
      next: {
        floor: 3,
        deltaCapacity: -1,
        next: {
          floor: 5,
          deltaCapacity: 1,
          next: null
        }
      }
    });
  });

  test('insert between two stops', () => {
    elevator.insertStop(4, 12);
    expect(elevator.program).toEqual({
      floor: 3,
      deltaCapacity: -1,
      next: {
        floor: 4,
        deltaCapacity: 12,
        next: {
          floor: 5,
          deltaCapacity: 1,
          next: null
        }
      }
    });
  });

  test('insert after last stop', () => {
    elevator.insertStop(8, 4);
    expect(elevator.program).toEqual({
      floor: 3,
      deltaCapacity: -1,
      next: {
        floor: 5,
        deltaCapacity: 1,
        next: {
          floor: 8,
          deltaCapacity: 4,
          next: null
        }
      }
    });
  });

  test('insert an entire job', () => {
    elevator.insertJob(4, 6);
    expect(elevator.program).toEqual({
      floor: 3,
      deltaCapacity: -1,
      next: {
        floor: 4,
        deltaCapacity: -1,
        next: {
          floor: 5,
          deltaCapacity: 1,
          next: {
            floor: 6,
            deltaCapacity: 1,
            next: null
          }
        }
      }
    });
  });
});