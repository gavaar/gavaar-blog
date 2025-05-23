import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const UL_REGEX = /(?<=^|\n)(-[ ][\s\S]+?)(?:\n\n|$)/g;

export const ul: ParserFn = text => {
  return parserFn({
    initText: text,
    compType: CompType.UnorderedList,
    regex: UL_REGEX,
    buildComp: match => ({ content: match[1] }),
  });
}
