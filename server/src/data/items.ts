import { IItem } from "../shared";

type Item = (quantity: number) => IItem;

export const GOLD: Item = (quantity: number) => ({
  name: "gold",
  quantity,
  sprite: "assets/objects/sp1.png_320_384_32_32",
  type: "USEABLE",
});

export const LONG_SLEEVE_SHIRT_M_BLACK: Item = (quantity: number) => ({
  name: "black longsleeve shirt (m)",
  sprite: "assets/objects/equipement/male/torso.png_0_0_32_32",
  quantity,
  type: "WEARABLE",
  equipSprite: "torso/longsleeve_shirt/black",
  equipSlot: "torso",
  bonus: {
    slash: 100,
  },
});
