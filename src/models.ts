export interface PropertyMap {
  [key: string]: Array<string>;
}

export interface OrderedParseResult {
  object: object;
  map: PropertyMap;
}
