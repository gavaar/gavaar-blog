
// matches > this is a quote
const BLOCKQUOTE_REGEX = /(?<=^|\n)(?:\>)((.|\n(?!\n))+)(?=\n\n|$)/g;

export const blockquote = (markdown: string): string => {
  const matches = markdown.matchAll(BLOCKQUOTE_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<blockquote>\n${match[1]}\n</blockquote>`);
  }

  return markdown;
};
