const SMALL_REGEX = /(?:\.\.)(\S[\s\S]*?)(?:\.\.)/g;

export const small = (markdown: string) => {
  const matches = markdown.matchAll(SMALL_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<small>${match[1] || match[2]}</small>`);
  }

  return markdown;
}
