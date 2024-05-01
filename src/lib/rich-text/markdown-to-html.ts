const BOLD_REGEX = /(?:[_|\*]{2})([^_\*]+?)(?:[_|\*]{2})/g;
const ITALIC_REGEX = /(?:_|\*)([^_\*]+?)(?:_|\*)/g;
const CODE_REGEX = /(?:`)([^`]+?)(?:`)/g;
const IMG_REGEX = /(?:!\[)([^\]\[]+?)(?:\])(?:\()([^\(\)]+?)(?:\))/g
const LINK_REGEX = /(?:\[)([^\]\[]+?)(?:\])(?:\()([^\(\)]+?)(?:\))/g

const subMatchesWithTag = ({ line, matchingRegex, tag, selfClosing }: { line: string; matchingRegex: RegExp; tag: string, selfClosing?: boolean }) => {
  const matches = line.matchAll(matchingRegex);
  let result = line;

  for (const match of matches) {
    const matchToReplace = match[0];
    const openingTag = `<${tag} `;
    let contentAndClosing = selfClosing ? `alt="${match[1]}" />` : `>${match[1]}</${tag}>`;

    if (match[2]) {
      contentAndClosing = `${selfClosing ? 'src' : 'href'}="${match[2]}" target="_blank" ` + contentAndClosing;
    }

    const newMatch = `${openingTag}${contentAndClosing}`;

    result = result.replace(matchToReplace, newMatch);
  }

  return result;
}

const lineBuilder = (line: string) => {
  line = subMatchesWithTag({ line, matchingRegex: BOLD_REGEX, tag: 'strong' });
  line = subMatchesWithTag({ line, matchingRegex: ITALIC_REGEX, tag: 'i' });
  line = subMatchesWithTag({ line, matchingRegex: CODE_REGEX, tag: 'code' });
  line = subMatchesWithTag({ line, matchingRegex: IMG_REGEX, tag: 'img', selfClosing: true });
  line = subMatchesWithTag({ line, matchingRegex: LINK_REGEX, tag: 'a' });

  return line;
}

const lineHtmlTag = (line: string): [string, string] => {
  if (line[0] === '#') {
    const [, hTagValue, rest] = line.match(/(.*?)[^#](.*)/) as [string, string, string];
    const hTag = `h${hTagValue.length}`;
  
    return [hTag, rest];
  }

  if (line[0] === '>') {
    return ['blockquote', line.substring(2)];
  }

  return ['p', line];
}

export const markdownToHtml = (markdown: string): string => {
  const lines = markdown.split('\\n');
  let parsedMarkdown = '';
    
  lineLoop:for (let line of lines) {
    if (!line.length) {
      parsedMarkdown += '<br />';
      continue lineLoop;
    }

    let [lineTag, restOfLine] = lineHtmlTag(line);

    parsedMarkdown += `<${lineTag}>${lineBuilder(restOfLine)}</${lineTag}>`;
  }

  return parsedMarkdown;
}
