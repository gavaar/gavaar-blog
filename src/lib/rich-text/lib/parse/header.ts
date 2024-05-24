// matches between # and ######
const HEADER_REGEX = /(?<=\n|^)(#{1,6})[^#](.+)(?=\n|$)/g;

export const header = (markdown: string): string => {
  const matches = markdown.matchAll(HEADER_REGEX);

  for (const match of matches) {
    const headerSize = match[1].length;

    markdown = markdown.replace(match[0], `<h${headerSize}>${match[2]}</h${headerSize}>`);
  }

  return markdown;
}
