// matches *content* and _content_ but NOT _content* or *content_
const ITALIC_REGEX = /(?<=^|[^\w_])(?:_)([^_]+)(?:_)(?=[^\w_]|$)|(?<=^|[^\w\*])(?:\*)([^\*]+)(?:\*)(?=[^\w\*]|$)/g;

export const italic = (markdown: string): string => {
  const matches = markdown.matchAll(ITALIC_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<em>${match[1] || match[2]}</em>`);
  }

  return markdown;
};
