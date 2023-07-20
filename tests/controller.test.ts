import { ElevatorController } from "../src/controller";
import { Elevator } from "../src/elevator";

let controller: ElevatorController;

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

  test('elevators negative pickup time are ignored', () => {
    controller.elevators[0].serviceDirection = -1;
    controller.elevators[1].serviceDirection = -1;
    controller.elevators[2].serviceDirection = 1;
    expect(controller.request(3, 4)).toBe(2);
  });

  test('the request is rejected if no elevators can take it', () => {
    controller.elevators[0].serviceDirection = -1;
    controller.elevators[1].serviceDirection = -1;
    controller.elevators[2].serviceDirection = -1;
    expect(controller.request(3, 4)).toBe(-1);
  });
});
