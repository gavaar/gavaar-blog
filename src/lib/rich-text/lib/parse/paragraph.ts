const PARAGRAPH_REGEX = /(?<=^|\n)([^\<\n].+)(?=$|\n)/g;

export const paragraph = (markdown: string): string => {
  const matches = markdown.matchAll(PARAGRAPH_REGEX);

  for (const match of matches) {
    const nonSpace = match[0].match(/([^\n].+[^\n])/)!;
    markdown = markdown.replace(nonSpace[0], `<p>${match[1]}</p>`);
  }

  return markdown;
};
