export interface TileSheet {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  version: number;
}

export interface Export {
  target: string;
}

export interface Editorsettings {
  export: Export;
}

export interface Object {
  gid: number;
  height: number;
  id: number;
  name: string;
  rotation: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface Layer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: 'tilelayer' | 'objectgroup';
  visible: boolean;
  width: number;
  x: number;
  y: number;
  draworder: string;
  // tslint:disable-next-line:ban-types
  objects: Object[];
}

export interface Tileset {
  firstgid: number;
  source: string;
}

export interface TileMap {
  compressionlevel: number;
  editorsettings: Editorsettings;
  height: number;
  infinite: boolean;
  layers: Layer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: Tileset[];
  tilewidth: number;
  type: string;
  version: number;
  width: number;
}
