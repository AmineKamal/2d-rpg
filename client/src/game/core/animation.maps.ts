import { StrictMap } from 'simple-structures';
import {
  Direction,
  IdleDirection,
  MoveDirection,
  SlashDirection,
  SpellDirection,
  ThrustDirection,
  OversizeDirection,
  ShootDirection,
} from '../shared';

export const IDLE_MAP: StrictMap<Direction, IdleDirection> = {
  up: 'i_up',
  down: 'i_down',
  right: 'i_right',
  left: 'i_left',
} as const;

export const MOVE_MAP: StrictMap<Direction, MoveDirection> = {
  up: 'm_up',
  down: 'm_down',
  right: 'm_right',
  left: 'm_left',
} as const;

export const SLASH_MAP: StrictMap<Direction, SlashDirection> = {
  up: 'sl_up',
  down: 'sl_down',
  right: 'sl_right',
  left: 'sl_left',
} as const;

export const SPELL_MAP: StrictMap<Direction, SpellDirection> = {
  up: 'sp_up',
  down: 'sp_down',
  right: 'sp_right',
  left: 'sp_left',
} as const;

export const THRUST_MAP: StrictMap<Direction, ThrustDirection> = {
  up: 't_up',
  down: 't_down',
  right: 't_right',
  left: 't_left',
} as const;

export const OVERSIZE_MAP: StrictMap<Direction, OversizeDirection> = {
  up: 'ov_up',
  down: 'ov_down',
  right: 'ov_right',
  left: 'ov_left',
} as const;

export const SHOOT_MAP: StrictMap<Direction, ShootDirection> = {
  up: 'sh_up',
  down: 'sh_down',
  right: 'sh_right',
  left: 'sh_left',
} as const;
