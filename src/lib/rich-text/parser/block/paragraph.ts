import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

// don't match lines that have block elements already
const PARAGRAPH_REGEX = /(?<=^|\n)(?!<gav:id=".+?\|type:block"\/>)(.+?)(?=\n|$)/g;

export const paragraph: ParserFn = text => {
  return parserFn({
    initText: text,
    elementType: 'block',
    compType: CompType.Paragraph,
    regex: PARAGRAPH_REGEX,
    buildComp: match => ({ content: match[0] }),
  });
}
