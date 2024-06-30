import { blankLine, blockquote, bold, code, codeBlock, header, horizontalRow, img, italic, link, paragraph, unorderedList, small } from './parse';
import { MarkdownMemory } from './parser-type';

const memoryIntoMarkdown = (memory: MarkdownMemory, markdown: string) => {
  Object.keys(memory).forEach(memoryId => {
    markdown = markdown.replace(memoryId, memory[memoryId]);
  });

  return markdown;
}

export const markdownToHtml = (markdown: string): string => {
  const memory: { [id: string]: string } = {};

  markdown = codeBlock(markdown, memory); // has to go first
  markdown = header(markdown);
  markdown = unorderedList(markdown);
  markdown = bold(markdown);
  markdown = italic(markdown); // italic must go after bold
  markdown = small(markdown);
  markdown = code(markdown);
  markdown = img(markdown);
  markdown = link(markdown); // link must go after img
  markdown = blockquote(markdown);
  markdown = horizontalRow(markdown);
  markdown = paragraph(markdown); // paragraph must go to almost the end
  markdown = blankLine(markdown); // blank lines should be last

  markdown = memoryIntoMarkdown(memory, markdown);

  return markdown;
};
