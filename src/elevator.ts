export class Elevator {
  program: Stop | Done;
  floor: number;
  totalCapacity: number;
  capacity: number;
  serviceDirection: number;

  constructor(totalCapacity: number) {
    this.totalCapacity = totalCapacity;
    this.floor = 0;
    this.capacity = totalCapacity;
    this.serviceDirection = 0;
    this.program = DONE;
  }

  hasCapacityForTrip(from: number, to: number): boolean {
    let curr = this.program;
    let capacity = this.capacity;
    const s = this.serviceDirection; // Changes the sign of the operations if the direction is -1

    if (s * from < s * curr.floor && capacity === 0) {
      return false;
    }

    while(curr !== DONE) {
      capacity += curr.deltaCapacity;
      if (s * curr.floor <= s * from && s * from < s * curr.next.floor && capacity === 0) {
        return false;
      }
      if (s * from < s * curr.floor && s * curr.floor < s * to && capacity === 0) {
        return false;
      }
      curr = curr.next;
    }

    return true;
  }

  isInOppositeDirection(from: number, to: number): boolean {
    const requestDirection = to - from;
    return (requestDirection * this.serviceDirection < 0);
  }

  calculatePickupTime(from: number, to: number): number {
    if (this.isInOppositeDirection(from, to)) {
      return -1;
    }

    if (this.program === DONE) {
      return Math.abs(from - this.floor);
    }

    if (this.hasCapacityForTrip(from, to)) {
      return Math.abs(this.program.floor - this.floor) + Math.abs(from - this.program.floor);
    } else {
      return -1;
    }
  }
}

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

class Done {
  floor = -1;
  deltaCapacity = -1;
  next = this;
}
export const DONE = new Done();
