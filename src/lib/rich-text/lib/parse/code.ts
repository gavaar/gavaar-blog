// matches `content`
const CODE_REGEX = /(?<=\s)(?:`)([^`]+)(?:`)(?=\s)/g;

export const code = (markdown: string): string => {
  const matches = markdown.matchAll(CODE_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<code>${match[1]}</code>`);
  }

  return markdown;
};
