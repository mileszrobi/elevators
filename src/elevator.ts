export class Elevator {
  floor: number;
  capacity: number;
  program: Stop | null;
  direction: number;

  constructor(capacity = 10) {
    this.floor = 0;
    this.capacity = capacity;
    this.program = null;
    this.direction = 0;
  }

  static fromJSON(json: Object) {
    return Object.assign(new Elevator(), json);
  }

  /*
  getDirection(): number {
    if (this.program === null) {
      return 0;
    }

    let a = this.floor;
    let b = this.program.floor
    if (this.program.next !== null) {
      a = this.program.floor;
      b = this.program.next.floor;
    }

    return b > a ? 1 : -1;
  }*/

  hasCapacityForTrip(from: number, to: number): boolean {
    let curr = this.program;
    let capacity = this.capacity;
    const s = this.direction; // Changes the sign of the operations if the direction is -1

    if (curr === null) {
      return true;
    }

    if (s * from < s * curr.floor && capacity === 0) {
      return false;
    }

    while(curr !== null && curr.next !== null) {
      capacity += curr.deltaCapacity;
      const next: Stop | null = curr.next;
      if (s * curr.floor <= s * from && s * from < s * next.floor && capacity === 0) {
        return false;
      }
      if (s * from < s * curr.floor && s * curr.floor < s * to && capacity === 0) {
        return false;
      }
      curr = next;
    }

    return true;
  }

  isInOppositeDirection(from: number, to: number): boolean {
    const requestDirection = to - from;
    return (requestDirection * this.direction < 0);
  }

  calculatePickupTime(from: number, to: number): number {
    if (this.isInOppositeDirection(from, to)) {
      return -1;
    }

    if (this.program === null) {
      return Math.abs(from - this.floor);
    }

    if (this.hasCapacityForTrip(from, to)) {
      return Math.abs(this.program.floor - this.floor) + Math.abs(from - this.program.floor);
    } else {
      return -1;
    }
  }

  insertStop(floor: number, deltaCapacity: number): void {
    const s = this.direction; // Changes the sign of the operations if the direction is -1
    if (this.program === null || s * floor < s * this.program.floor) {
      this.program = {
        floor: floor,
        deltaCapacity: deltaCapacity,
        next: this.program,
      }
    } else {
      let curr: Stop | null = this.program;
      while (curr !== null) {
        const next: Stop | null = curr.next;
        if (curr.floor === floor) {
          curr.deltaCapacity += deltaCapacity;
          return;
        } else if (s * curr.floor < s * floor && (next == null || s * floor < s * next.floor)) {
          curr.next = {
            floor: floor,
            deltaCapacity: deltaCapacity,
            next: next
          }
          return;
        }
        curr = next;
      }
    }
  }

  insertJob(from: number, to: number): void {
    if (this.direction === 0) {
      this.direction = to > from ? 1 : -1;
    }
    this.insertStop(from, -1);
    this.insertStop(to, 1);
  }
}

export class Stop {
  floor: number;
  deltaCapacity: number;
  next: Stop | null;

  constructor(floor: number, deltaCapacity: number) {
    this.floor = floor;
    this.deltaCapacity = deltaCapacity;
    this.next = null;
  }
}
