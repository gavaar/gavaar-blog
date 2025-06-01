import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const IMAGE_REGEX = /(?<=^|\n)(?:!\[)([^\[\]]+?)(?:\]\()([^\(\)]+?)(?:\))(?=$|\n)/g

export const image: ParserFn = text => {
  return parserFn({
    initText: text,
    elementType: 'block',
    compType: CompType.Image,
    regex: IMAGE_REGEX,
    buildComp: match => {
      const [_, content, url] = match;
      return { content, input: { url } };
    },
  });
}
