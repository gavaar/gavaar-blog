import { CompType, ParserFn } from '../rich-text.types';
import { parserFn } from './base';

const SMALL_REGEX = /(?:\.\.)(\S[\s\S]+?)(?:\.\.)/g;

export const small: ParserFn = text => {
  return parserFn({
    initText: text,
    regex: SMALL_REGEX,
    compType: CompType.Small,
    buildComp: match => ({ content: match[1] }),
  });
}
