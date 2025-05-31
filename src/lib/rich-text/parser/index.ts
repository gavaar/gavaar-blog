import { Injectable } from '@angular/core';
import { ParsedComponent, ParsedMap, ParserFn } from '../rich-text.types';
import { base } from './base';
import { blockquote, codeBlock, header, horizontalRow, image, paragraph, ul } from './block';
import { bold, code, italic, link, small } from './inline';

const PARSER_REGEX = /<gav:id="(.+?\|type:.+?)"\/>\n?/g;
@Injectable({ providedIn: 'root' })
export class Parser {
  private updated = '';
  private idMap: ParsedMap = {};

  /**
   * Set a starting text, unless there is already one.
   */
  initText(text: string): Parser {
    this.updated = text;
    return this;
  }

  // block level elements
  blockquote = () => this.applyParser(blockquote);
  codeBlock = () => this.applyParser(codeBlock);
  header = () => this.applyParser(header);
  horizontalRow = () => this.applyParser(horizontalRow);
  image = () => this.applyParser(image);
  paragraph = () => this.applyParser(paragraph)
  ul = () => this.applyParser(ul);
  // inline level elements
  bold = () => this.applyParser(bold);
  code = () => this.applyParser(code);
  italic = () => this.applyParser(italic);
  link = () => this.applyParser(link);
  small = () => this.applyParser(small);

  result = (): ParsedComponent[] => {
    return this.updated.split(PARSER_REGEX)
      .map(content => {
        const [id] = content.split('|type:');
        const builtComp = this.idMap[id];
       
        if (builtComp) return builtComp;
        return base(id);
      });
  }

  /** 
   * meta functions that apply the parser function and updates
   * the Parser.updated and Parser.idMap objects, to be used later
   * by the result function.
   */
  private applyParser = (parser: ParserFn) => {
    const { idMap, updatedText } = parser(this.updated);
    Object.assign(this.idMap, idMap);
    this.updated = updatedText;

    return this;
  }
}
