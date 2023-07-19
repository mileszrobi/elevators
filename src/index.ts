class Done {
  floor = -1;
  deltaCapacity = -1;
  next = this;
}
export const DONE = new Done();

export class Stop {
  floor: number;
  deltaCapacity: number;
  next: Stop | Done;

  constructor(floor: number, deltaCapacity: number) {
    this.floor = floor;
    this.deltaCapacity = deltaCapacity;
    this.next = DONE;
  }
}

export class Elevator {
  program: Stop | Done;
  floor: number;
  totalCapacity: number;
  capacity: number;
  serviceDirection: number;

  constructor(totalCapacity: number, floor = 0) {
    this.floor = floor;
    this.totalCapacity = totalCapacity;
    this.capacity = totalCapacity;
    this.serviceDirection = 0;
    this.program = DONE;
  }

  hasCapacityForTrip(from: number, to: number): boolean {
    let curr = this.program;
    let capacity = this.capacity;

    if (from < curr.floor && capacity === 0) {
      return false;
    }

    while(curr !== DONE) {
      capacity += curr.deltaCapacity;
      if (curr.floor <= from && from < curr.next.floor && capacity === 0) {
        return false; // No capacity to server request.
      }
      if (from < curr.floor && curr.floor < to && capacity === 0) {
        return false;
      }
      curr = curr.next;
    }

    return true;
  }

  calculatePickupTime(from: number, to: number): number {
    if (this.hasCapacityForTrip(from, to)) {
      return Math.abs(from - this.floor);
    } else {
      return -1;
    }
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