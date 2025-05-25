import { CompType, ParserFn } from '../../rich-text.types';
import { parserFn } from '../base';

const CODE_BLOCK_REGEX = /(?<=^|\n)```(\w*?)\n([\s\S]+?)```(?=\n|$)/g;
const LANGUAGES_ALIASES: { [alias: string]: string } = {
  sh: 'bash',
};

export const codeBlock: ParserFn = text => {
  return parserFn({
    initText: text,
    compType: CompType.CodeBlock,
    regex: CODE_BLOCK_REGEX,
    buildComp: match => {
      const language = LANGUAGES_ALIASES[match[1]] || match[1] || 'markup';
      const content = match[2];
      return { content, input: { language } };
    },
  });
}
