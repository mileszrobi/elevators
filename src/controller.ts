import { Elevator } from "./elevator";

class Scored {
  constructor(public elevator: Elevator, public index: number, public score: number) {}
}

export class ElevatorController {
  elevators: Elevator[];

  constructor(elevators: Elevator[]) {
    this.elevators = elevators;
  }

  request(from: number, to: number): number {
    const scores: Scored[] = []
    for (let i = 0; i < this.elevators.length; i++) {
      const elevator = this.elevators[i];
      scores.push({elevator: elevator, score: elevator.calculatePickupTime(from, to), index: i});
    }
    const sortedList = scores.filter(s => s.score > -1).sort((a, b) => {return a.score - b.score});
    console.log(sortedList);
    if (sortedList.length > 0) {
      return sortedList[0].index;
    }
    return -1;
  }
}
