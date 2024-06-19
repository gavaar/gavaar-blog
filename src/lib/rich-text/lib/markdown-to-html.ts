import { blankLine, blockquote, bold, code, codeBlock, codeBlockCleanup, header, horizontalRow, img, italic, link, paragraph, unorderedList, specialCharacters, small } from './parse';

export const markdownToHtml = (markdown: string): string => {
  markdown = specialCharacters(markdown);
  markdown = header(markdown);
  markdown = unorderedList(markdown);
  markdown = bold(markdown);
  markdown = italic(markdown); // italic must go after bold
  markdown = small(markdown);
  markdown = codeBlock(markdown); // codeBlock has to be before code
  markdown = code(markdown);
  markdown = img(markdown);
  markdown = link(markdown); // link must go after img
  markdown = blockquote(markdown);
  markdown = horizontalRow(markdown);
  markdown = paragraph(markdown); // paragraph must go to almost the end
  markdown = blankLine(markdown); // blank lines should be last
  markdown = codeBlockCleanup(markdown); // this has to be last

  return markdown;
};
