# Controller logic
Assumptions:
- every person will indicate their own targets individually (no groups)
- every person plays nice: they will get on and off on the appropriate floors and they will use the assigned elevator

A request is made from floor F to floor T.

Elevator:
- current floor
- current capacity
- current service direction
  - 0 if idle
- total capacity
- program
  - stop {floor, delta capacity}
  - first item is DONE if idle

Which elevator can serve the request:
- Filter out elevators going in the opposite direction.
- Filter out elevators that do not have capacity to serve the trip.
  - Between F and T, it continuously needs to have capacity
- Check elevators that are already moving, sort by service time (closest to F)
- If no such elevator, check idle elevators, get the closest to F
- If no such elevator, reject the request



