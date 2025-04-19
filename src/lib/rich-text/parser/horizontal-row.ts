import { CompType, ParserFn } from '../rich-text.types';
import { parserFn } from './base';

const HORIZONTAL_ROW_REGEX = /(?<=^|\n)---(?:\n|$)/g;

export const horizontalRow: ParserFn = text => {
  return parserFn({
    regex: HORIZONTAL_ROW_REGEX,
    compType: CompType.HorizontalRow,
    initText: text,
    buildComp: _ => ({ content: '' }),
  });
}
