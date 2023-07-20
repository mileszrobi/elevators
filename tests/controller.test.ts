import { ElevatorController } from "../src/controller";
import { Elevator, Stop } from "../src/elevator";

let controller: ElevatorController;

const oppositeDirectionProgram: Stop = {
  floor: 10,
  deltaCapacity: -1,
  next: {
    floor: 8,
    deltaCapacity: 1,
    next: null
  }
};

describe('Determining which elevator will service a request', () => {
  beforeEach(() => {
    const elevators = [
      new Elevator(2),
      new Elevator(2),
      new Elevator(2),
    ]
    controller = new ElevatorController(elevators);
  });

  test('if pickup times are the same, the first elevator takes the job', () => {
    expect(controller.request(1, 2)).toBe(0);
  });

  test('choose the elevator with the smallest pickup time', () => {
    controller.elevators[0].floor = 0;
    controller.elevators[1].floor = 2;
    controller.elevators[2].floor = 1;
    expect(controller.request(3, 4)).toBe(1);
  });

  test('elevators with negative pickup time are ignored', () => {
    controller.elevators[0].direction = -1;
    controller.elevators[1].direction = -1;
    expect(controller.request(3, 4)).toBe(2);
  });

  test('the request is rejected if no elevators can take it', () => {
    controller.elevators[0].direction = -1;
    controller.elevators[1].direction = -1;
    controller.elevators[2].direction = -1;
    expect(controller.request(3, 4)).toBe(-1);
  });
});
