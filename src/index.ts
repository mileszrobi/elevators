import { ElevatorController } from "./controller";
import { Elevator } from "./elevator";
import * as fs from 'fs';
import yargs from "yargs/yargs";

class Request {
  constructor(public from: number, public to: number) {}
}

function replay(elevatorConfigPath: string, requestLogPath: string): void {
  const elevators: Elevator[] = [];
  for (const json of JSON.parse(fs.readFileSync(elevatorConfigPath, 'utf-8'))) {
    elevators.push(Elevator.fromJSON(json));
  }
  
  const requests: Request[] = JSON.parse(fs.readFileSync(requestLogPath, 'utf-8'));
  
  const controller = new ElevatorController(elevators);
  for (const r of requests) {
    const selectedElevator = controller.request(r.from, r.to);
    if (selectedElevator === -1) {
      console.log(`Request ${JSON.stringify(r)} cannot be fulfilled at the time`);
    } else {
      console.log(`Request ${JSON.stringify(r)} is serviced by elevator number ${selectedElevator + 1}`);
    }
  }
  
  console.log('The final state of the elevators');
  elevators.forEach(e => console.log(JSON.stringify(e, null, 2)));  
}

const argv = yargs(process.argv.slice(2))
  .command('replay', 'replay a scenario of predefined passenger requests', 
    yargs => {
      yargs.option('elevatorConfig', {
        alias: 'e',
        type: 'string',
        description: 'path to the elevator config json'
      });
      yargs.option('requestLog', {
        alias: 'r',
        type: 'string',
        description: 'path to the request log json'
      });
      yargs.check(argv => {
        if (argv.elevatorConfig === undefined || argv.requestLog === undefined) {
          throw new Error('Please define both the elevator config and the request log locations');
        }
        return true;
      })
      return yargs;
    },
    argv => {
      console.log(argv)
      replay(argv.elevatorConfig as string, argv.requestLog as string);
    }
  )
  .parse();