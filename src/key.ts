import escapeStringRegexp from 'escape-string-regexp';

export const escapeKey = (key: string, separator: string): string => {
  const stringsToEscape = ['\\', separator];
  const pattern = stringsToEscape
    .map((string) => escapeStringRegexp(string))
    .join('|');

  return key.replace(new RegExp(`(${pattern})`, 'g'), '\\$1');
};

export const splitKey = (key: string, separator: string): Array<string> => {
  // if key doesn't have any escape sequence avoid iterating through the characters.
  if (key.indexOf('\\') < 0) {
    return key.split(separator);
  }

  const parts: Array<string> = [];
  let currentPart = '';
  let isLiteral = false;

  for (let index = 0; index < key.length; index++) {
    const character = key[index];

    if (isLiteral) {
      currentPart += character;
      isLiteral = false;
    } else if (character === '\\') {
      isLiteral = true;
    } else if (
      character === separator[0] &&
      key.substr(index, separator.length) === separator
    ) {
      parts.push(currentPart);
      currentPart = '';
      index += separator.length - 1;
    } else {
      currentPart += character;
    }
  }

  parts.push(currentPart);

  return parts;
};
