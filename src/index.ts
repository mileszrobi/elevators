export class Elevator {
  totalCapacity: number;
  currentCapacity: number;
  workQueue: [number, number][]; // floor, delta capacity pairs
  onFloor: number;

  constructor(totalCapacity: number) {
    this.totalCapacity = totalCapacity;
    this.currentCapacity = totalCapacity;
    this.workQueue = [];
    this.onFloor = 0;
  }

  travelCost(from: number, to: number): number {
    return Math.abs(from - this.onFloor) + Math.abs(to - from);
  }
}

export class ElevatorController {
  elevators: Elevator[];

  constructor(elevatorCount: number, elevatorCapacity: number) {
    this.elevators = [];
    for (let i = 0; i < elevatorCount; i++) {
      this.elevators[i] = new Elevator(elevatorCapacity);
    }
  }
}