// matches ```content```
const CODE_BLOCK_REGEX = /```([\s\S]+?)```/g;

export const codeBlock = (markdown: string): string => {
  const matches = markdown.matchAll(CODE_BLOCK_REGEX);
  
  for (const match of matches) {
    markdown = markdown.replace(match[0], `<pre>${match[1]}</pre>`);
  }
  
  return markdown;
};

// matches all instances of <element>(.+)</element> to remove them
const PRE_INNER_BLOCKS = /(?:<pre>)([\s\S]+?)(?:<\/pre>)/g;
const REMOVE_ELEMENT_BLOCKS_REGEX = /<.+?>/g;

export const codeBlockCleanup = (markdown: string): string => {
  const matches = markdown.matchAll(PRE_INNER_BLOCKS);

  for (const match of matches) {
    let updatedInnerPre = match[1];
    const foundElements = match[1].matchAll(REMOVE_ELEMENT_BLOCKS_REGEX);

    for (const elementFound of foundElements) {
      updatedInnerPre = updatedInnerPre.replace(elementFound[0], '');
    }

    markdown = markdown.replace(match[1], updatedInnerPre);
  }


  return markdown;
}
