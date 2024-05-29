// matches **content** and __content__ but NOT __content**, **content__, _*content_* or any other combination
const BOLD_REGEX = /(?<=^|[^\w_])(?:__)([^_]+)(?:__)(?=[^\w_]|$)|(?<=^|[^\w\*])(?:\*\*)([^\*]+)(?:\*\*)(?=[^\w\*]|$)/g;

export const bold = (markdown: string): string => {
  const matches = markdown.matchAll(BOLD_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<strong>${match[1] || match[2]}</strong>`);
  }

  return markdown;
};
