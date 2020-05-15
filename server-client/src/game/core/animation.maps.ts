import { StrictMap } from 'simple-structures';
import {
  Direction,
  IdleDirection,
  MoveDirection,
  SlashDirection,
  SpellDirection,
  Dir,
} from '../shared';

export const IDLE_MAP: StrictMap<Dir, IdleDirection> = {
  up: 'i_up',
  down: 'i_down',
  right: 'i_right',
  left: 'i_left',
} as const;

export const MOVE_MAP: StrictMap<Dir, MoveDirection> = {
  up: 'm_up',
  down: 'm_down',
  right: 'm_right',
  left: 'm_left',
} as const;

export const SLASH_MAP: StrictMap<Dir, SlashDirection> = {
  up: 'sl_up',
  down: 'sl_down',
  right: 'sl_right',
  left: 'sl_left',
} as const;

export const SPELL_MAP: StrictMap<Dir, SpellDirection> = {
  up: 'sp_up',
  down: 'sp_down',
  right: 'sp_right',
  left: 'sp_left',
} as const;
