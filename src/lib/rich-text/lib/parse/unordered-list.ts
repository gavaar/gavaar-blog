const UL_REGEX = /(?<=^|\n\n)(-[^-](?:.|\n[^\n])+)(?=\n\n|$)/g;
const LI_REGEX = /(?:-[\s])((?:.|\n[^-])+)(?:\n|$)/g;

export const unorderedList = (markdown: string): string => {
  const listMatches = markdown.matchAll(UL_REGEX);

  for (const list of listMatches) {
    markdown = markdown.replace(list[0], `<ul>${list[1]}</ul>`);
    const itemMatches = list[1].matchAll(LI_REGEX);

    for (const item of itemMatches) {
      markdown = markdown.replace(item[0], `<li>${item[1]}</li>`);
    }
  }

  return markdown;
};
