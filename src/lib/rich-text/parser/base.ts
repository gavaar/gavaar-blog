import { CompType, ParsedComponent, ParsedMap, ParserFn } from '../rich-text.types';

const identifiers = Object.fromEntries(Object.values(CompType).map(key => [key, 0]));

type ParserFnInput = {
  initText: string;
  regex: RegExp;
  compType: CompType;
  elementType: 'block' | 'inline';
  buildComp: (match: RegExpExecArray) => Pick<ParsedComponent, 'content' | 'input'>;
}
export const parserFn = ({ initText, regex, compType, elementType, buildComp }: ParserFnInput): ReturnType<ParserFn> => {
  const matches = initText.matchAll(regex);
  const idMap: ParsedMap = {};
  let updatedText = initText;

  for (const match of matches) {
    const id = `${compType}::${identifiers[compType]}`;
    const { content, input } = buildComp(match);

    const comp: ParsedComponent = {
      id,
      content,
      input,
      type: compType,
    };
    idMap[id] = comp;

    updatedText = updatedText.replace(match[0], `<gav:id="${id}|type:${elementType}"/>`);
    identifiers[compType] += 1;
  }

  return { idMap, updatedText };
}

export const base: (text: string) => ParsedComponent = text => {
  const id = `${CompType.Base}_${identifiers[CompType.Base]}`;

  const comp: ParsedComponent = {
    id,
    content: text,
    type: CompType.Base,
  };

  identifiers[CompType.Base] += 1;

  return comp;
}
