// matches ![alt-text-value](image-src-value)
const IMG_REGEX = /(?:!\[)([^\[\]]+)(?:\]\()([^\(\)]+)(?:\))/g

export const img = (markdown: string): string => {
  const matches = markdown.matchAll(IMG_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<a class="img-container" href="${match[2]}" target="_blank"><img alt="${match[1]}" src="${match[2]}"/></a>`);
  }

  return markdown;
};
