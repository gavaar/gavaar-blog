import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const BLOCKQUOTE_REGEX = /(?<=^|\n)(?:\>[ ])([\s\S]+?)(?=\n\n|$)/g;

export const blockquote: ParserFn = text => {
  return parserFn({
    initText: text,
    regex: BLOCKQUOTE_REGEX,
    compType: CompType.Blockquote,
    buildComp: match => ({ content: match[1] }),
  });
}
