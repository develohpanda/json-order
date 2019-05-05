export interface PropertyMap {
    [key: string]: Array<string>
}

export interface OrderedParseResult {
    result: Object,
    map: PropertyMap
}