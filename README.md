# Usage

There are two main ways to test the elevator configuration logic. One is through the CLI, the other is using unit tests.

## CLI

You can replay a set of requests from the command line, like so:

`npm start -- replay -e config/simple.elevator.config.json -r config/simple.request.log.json`

This command expects an elevator configuration file and a request log file. The elevator configuration file contains the positions and capacities of the elevators in the buildling, while he request log contains a list of passenger requests, defining which floor each passenger is on, and where they want to travel.

## Unit test

Another way can set up a scenario is to create a unit test. An example for this is provided in `tests/example.scenario.tests.ts`. This file contains comments to guide you through the setup. Once you are happy with the configuration, you can run your scenario with the command:

`npm test tests/example.scenario.test.ts`

Or you can just run all the tests with:

`npm test`


# Controller logic

The elevator controller is responsible for assigning an elevator to an incoming request, if possible. It does so by evaluating the `pickup time` of the request for each of the elevators in the system.

The pickup time is determined by each of the elevators, considering a number of factors. To calculate the pickup time, the elevators consider the following parameters:
* The floor the elevator is currently on,
* the direction of travel,
* the current capacity of the elevator,
* and the stops that are currently planned for the elevator.

Let's assume the passenger is on floor F (from), and wants to get to floor T (to). The calculation of the pickup time will go through the following steps:
 * If an elevator is idle, then the pickup time for the request is the difference between the elevator's current floor, and F.
 * If an elevator is already moving, then there are a couple of scenarios it considers:
   * If the request is in the opposite direction as the elevator is currently servicing, then the request is rejected. The elevator will not consider queueing in the request for the return journey.
   * If the request is in the same direction as the elevator is servicing, then it will consider if it will have capacity to fulfill the request along the way. For this, the elevator maintains a list of stops it will have to make, called the `program`. If adding the new request into this list will not overload the elevator (meaning it's over capacity) at any of the stops between F (inclusive) and T (exclusive), then the request can be fulfilled and the pickup time is the sum of the moves the elevator will have to make to get to F.

Once the controller gathered all the pickup times for a given request, it will do the following to determine which elevator should fulfill the request:
* It filters out all the elevators that cannot take the request (either because of the direction of travel, or because of lack of capacity),
* it will sort the remaining elevators according to their pickup times,
* and will select the first elevator from the list. If the list is empty, the controller will reject the request.

Finally, the selected elevator will add the new job into its program, so that it can be considered for future requests.
