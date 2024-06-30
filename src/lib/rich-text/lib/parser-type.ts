
export type MarkdownMemory = { [parserId: string]: string };
/**
 * @returns [updatedMarkdownValue, { [memoryPiece: string]: string }] - where updatedMarkdownValue has a string value
 * that has its parsed contents substitued with ids `before piece of string{CODE_BLOCK_0}after piece of string` (for example). And the memoryPiece is equal to the
 * `[id]: parsedValue`, in order for these to be put back into the string in the end. 
 */
export type MarkdownParser = (markdown: string, memory: MarkdownMemory) => string;
