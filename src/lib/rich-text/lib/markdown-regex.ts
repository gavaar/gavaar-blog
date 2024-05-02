// matches between # and ######
export const POUND_REGEX = /(.*?)[^#](.*)/;
// matches **content** and __content__
export const BOLD_REGEX = /(?:[_|\*]{2})([^_\*]+?)(?:[_|\*]{2})/g;
// matches *content* and _content_
export const ITALIC_REGEX = /(?:_|\*)([^_\*]+?)(?:_|\*)/g;
// matches `content`
export const CODE_REGEX = /(?:`)([^`]+?)(?:`)/g;
// matches ![alt-text-value](image-src-value)
export const IMG_REGEX = /(?:!\[)([^\]\[]+?)(?:\])(?:\()([^\(\)]+?)(?:\))/g
// matches [link-text-content](link-target-href)
export const LINK_REGEX = /(?:\[)([^\]\[]+?)(?:\])(?:\()([^\(\)]+?)(?:\))/g
