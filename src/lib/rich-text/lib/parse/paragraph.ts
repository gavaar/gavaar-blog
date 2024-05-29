const PARAGRAPH_REGEX = /(?<=^|\n)([^\<\n].+)(?=$|\n)/g;

export const paragraph = (markdown: string): string => {
  const matches = markdown.matchAll(PARAGRAPH_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<p>${match[1]}</p>`);
  }

  return markdown;
};
