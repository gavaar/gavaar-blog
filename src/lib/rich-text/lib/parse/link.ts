// matches [link-text-content](link-target-href)
const LINK_REGEX = /(?:\[)([^\[\]]+)(?:\]\()([^\(\)]+)(?:\))/g

export const link = (markdown: string): string => {
  const matches = markdown.matchAll(LINK_REGEX);

  for (const match of matches) {
    markdown = markdown.replace(match[0], `<a href="${match[2]}" target="_blank">${match[1]}</a>`);
  }

  return markdown;
};
