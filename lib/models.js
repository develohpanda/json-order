// @flow

export type PropertyMap = {
    [key: string]: Array<string>
}

export type OrderedParseResult = {
    result: Object,
    map: PropertyMap
}