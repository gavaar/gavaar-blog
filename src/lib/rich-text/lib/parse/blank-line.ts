const BR_REGEX = /(?:\n\n)(\n+)/g;

export const blankLine = (markdown: string): string => {
  const matches = markdown.matchAll(BR_REGEX);

  for (const match of matches) {
    const emptyLines = Array(match[1].length).fill('<br />').join('');
    markdown = markdown.replace(match[0], emptyLines);
  }

  return markdown;
}
