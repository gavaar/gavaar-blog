import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const BOLD_REGEX = /(?:(?:__)(.+?)(?:__)|(?:\*\*)(.+?)(?:\*\*)|(?:\*_)(.+?)(?:\*_)|(?:_\*)(.+?)(?:_\*))/g;

export const bold: ParserFn = text => {
  return parserFn({
    initText: text,
    compType: CompType.Bold,
    regex: BOLD_REGEX,
    buildComp: match => ({ content: match[1] || match[2] || match[3] || match[4] }),
  });
}
