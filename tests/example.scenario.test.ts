import { ElevatorController } from "../src/controller";
import { Elevator, Stop } from "../src/elevator";

let controller: ElevatorController;

describe('Replaying an example scenario', () => {
  beforeEach(() => {
    // Create elevators with their capacities
    const elevators = [
      new Elevator(2),
      new Elevator(2),
      new Elevator(2),
    ]

    // Modify positions if necessary
    elevators[1].floor = 4;
    
    // Add existing routes if necessary
    elevators[0].insertJob(3, 6);
    elevators[2].insertJob(8, 4);

    // Create elevator controller
    controller = new ElevatorController(elevators);
  });

  test('insert a new job', () => {
    const selectedElevatorIndex = controller.request(4, 7);

    if (selectedElevatorIndex === -1) {
      console.log(`The request cannot be fulfilled`);
    } else {
      console.log(`The request is fulfilled by elevator ${selectedElevatorIndex}`);
    }

    console.log('The final state of the elevators');
    controller.elevators.forEach(e => console.log(JSON.stringify(e, null, 2))); 
  });
});

