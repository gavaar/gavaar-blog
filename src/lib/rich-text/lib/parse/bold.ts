// matches **content** and __content__ but NOT __content**, **content__, _*content_* or any other combination
const BOLD_REGEX = /(?<=^|[\s\*])(?:__)([^_]+)(?:__)(?=[\s\*]|$)|(?<=^|[\s_])(?:\*\*)([^\*]+)(?:\*\*)(?=[\s_]|$)/g;

export const bold = (markdown: string): string => {
  const matches = markdown.matchAll(BOLD_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<strong>${match[1] || match[2]}</strong>`);
  }

  return markdown;
};
