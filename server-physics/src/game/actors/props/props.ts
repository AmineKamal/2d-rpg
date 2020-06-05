import { StrictMap } from 'simple-structures';
import { Tree } from './tree';
import * as Tiled from '../../core/tiled';
import { Sprite } from 'excalibur';
import { Prop } from './prop';

export const PROP_TYPES = ['tree1'] as const;
export type PropType = typeof PROP_TYPES[number];
export type PropSprite = 'normal' | 'highlight';

type PropCreator = (obj: Tiled.Object, sp: Sprite) => Promise<Prop>;

export const PROPS: StrictMap<PropType, PropCreator> = {
  tree1: async (obj: Tiled.Object, sp: Sprite) => await Tree.create(obj, sp),
};
