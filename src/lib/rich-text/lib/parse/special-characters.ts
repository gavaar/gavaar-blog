export const specialCharacters = (markdown: string): string => {
  markdown = markdown.replaceAll('<', '&lt;');
  return markdown;
}
