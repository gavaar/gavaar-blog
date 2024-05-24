// matches *content* and _content_ but NOT _content* or *content_
const ITALIC_REGEX = /(?<=^|[\s\*])(?:_)([^_]+)(?:_)(?=[\s\*]|$)|(?<=^|[\s_])(?:\*)([^\*]+)(?:\*)(?=[\s_]|$)/g;

export const italic = (markdown: string): string => {
  const matches = markdown.matchAll(ITALIC_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<i>${match[1] || match[2]}</i>`);
  }

  return markdown;
};
