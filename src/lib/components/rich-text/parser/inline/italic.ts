import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const ITALIC_REGEX = /(?:(?:_)([^_]+?)(?:_)|(?:\*)([^\*]+?)(?:\*))/g;

export const italic: ParserFn = text => {
  return parserFn({
    initText: text,
    elementType: 'inline',
    compType: CompType.Italic,
    regex: ITALIC_REGEX,
    buildComp: match => ({ content: match[1] || match[2] }),
  });
}
