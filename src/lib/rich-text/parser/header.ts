import { CompType, ParserFn } from '../rich-text.types';
import { parserFn } from './base';

const HEADER_REGEX = /(?<=\n|^)(#{1,6})[ ](.+?)(?:\n|$)/g;

export const header: ParserFn = text => {
  return parserFn({
    initText: text,
    compType: CompType.Header,
    regex: HEADER_REGEX,
    buildComp: match => {
      const size = match[1].length;
      const content = match[2];
      return { content, input: { size } };
    },
  });
}
