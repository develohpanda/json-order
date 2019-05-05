export interface PropertyMap {
  [key: string]: Array<string>;
}

export interface OrderedParseResult {
  result: object;
  map: PropertyMap;
}
