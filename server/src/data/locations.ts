import { StrictMap } from "simple-structures/lib/lib/types";
import { MapLocation } from "../shared";

type Point = { x: number; y: number };

type Destination = Readonly<
  { [k in MapLocation]?: Readonly<Point> } & {
    else: Readonly<Point>;
  }
>;

export function location(from: MapLocation, to: MapLocation) {
  console.log(to);
  const dest = INITIAL_LOCATIONS[to];

  if (dest[from]) return dest[from];
  else return dest.else;
}

export const INITIAL_LOCATIONS: StrictMap<MapLocation, Destination> = {
  m1: {
    m2: { x: 303, y: 40 },
    else: { x: 303, y: 557 }
  },
  m2: {
    m1: { x: 81, y: 589 },
    else: { x: 338, y: 327 }
  }
};
