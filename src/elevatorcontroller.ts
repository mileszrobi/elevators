import { Elevator } from "./elevator";

export class ElevatorController {
  elevators: Elevator[];

  constructor(elevatorCount: number, elevatorCapacity: number) {
    this.elevators = [];
    for (let i = 0; i < elevatorCount; i++) {
      this.elevators[i] = new Elevator(elevatorCapacity);
    }
  }
}
