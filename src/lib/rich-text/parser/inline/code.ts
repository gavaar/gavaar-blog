import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const CODE_REGEX = /(?:`)(.+?)(?:`)/g

export const code: ParserFn = text => {
  return parserFn({
    initText: text,
    elementType: 'inline',
    compType: CompType.Code,
    regex: CODE_REGEX,
    buildComp: match => ({ content: match[1] }),
  });
}
