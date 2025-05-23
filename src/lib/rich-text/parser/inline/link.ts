import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const LINK_REGEX = /(?:\[)([^\[\]]+?)(?:\]\()([^\(\)]+?)(?:\))/g

export const link: ParserFn = text => {
  return parserFn({
    initText: text,
    compType: CompType.Link,
    regex: LINK_REGEX,
    buildComp: match => {
      const [_, content, url] = match;
      return { content, input: { url } };
    },
  });
}
