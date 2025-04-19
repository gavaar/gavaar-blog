export enum CompType {
  Base = 'base',
  Bold = 'bold',
  Blockquote = 'blockquote',
  Code = 'code',
  CodeBlock = 'codeBlock',
  Header = 'header',
  HorizontalRow = 'horizontalRow',
  Italic = 'italic',
  Image = 'image',
  Link = 'link',
  Small = 'small',
  UnorderedList = 'unorderedList',
}

export type ParsedComponent = {
  id: string;
  content: string;
  type: CompType;
  input?: { [name: string]: any };
}

export type ParsedMap = { [id: string]: ParsedComponent };
export type ParserFn = (text: string) => { idMap: ParsedMap, updatedText: string };
