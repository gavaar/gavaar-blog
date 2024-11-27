import PrismJs from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import { MarkdownMemory, MarkdownParser } from '../parser-type';

// matches ```content```
const CODE_BLOCK_REGEX = /```(\w*?)\n([\s\S]+?)```/g;
const LANGUAGES_ALIASES: { [alias: string]: string } = {
  sh: 'bash',
};

export const codeBlock: MarkdownParser = (markdown: string, memory: MarkdownMemory) => {
  const matches = markdown.matchAll(CODE_BLOCK_REGEX);
  let i = 0;

  for (const match of matches) {
    const language = LANGUAGES_ALIASES[match[1]] || match[1] || 'ts';
    const markdownId = `<CODE_BLOCK_${i}>`;
    i += 1;

    memory[markdownId] = `<pre>${PrismJs.highlight(match[2], PrismJs.languages[language], language)}</pre>`;
    markdown = markdown.replace(match[0], markdownId);
  }
  
  return markdown;
};
