// matches ---
const HR_REGEX = /(?<=\n)---(?=\n|$)/g;

export const horizontalRow = (markdown: string): string => {
  markdown = markdown.replace(HR_REGEX, '<hr />');

  return markdown;
};
