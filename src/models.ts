export interface PropertyMap {
  [key: string]: Array<string>;
}

export interface OrderedParseResult<T> {
  object: T;
  map: PropertyMap;
}
