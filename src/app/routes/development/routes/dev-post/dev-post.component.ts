import { ChangeDetectionStrategy, Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../../entity';
import { map, startWith, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';

const BOLD_REGEX = /(?:[_|\*]{2})([^_\*]+?)(?:[_|\*]{2})/g;
const ITALIC_REGEX = /(?:_|\*)([^_\*]+?)(?:_|\*)/g;
const CODE_REGEX = /(?:`)([^`]+?)(?:`)/g;

const subMatchesWithTag = ({ line, matchingRegex, tag }: { line: string; matchingRegex: RegExp; tag: string }) => {
  const matches = line.matchAll(matchingRegex);
  let result = line;

  for (let match of matches) {
    result = result.replace(match[0], `<${tag}>${match[1]}</${tag}>`);
  }

  return result;
}

const lineBuilder = (line: string) => {
  line = subMatchesWithTag({ line, matchingRegex: BOLD_REGEX, tag: 'strong' });
  line = subMatchesWithTag({ line, matchingRegex: ITALIC_REGEX, tag: 'i' });
  line = subMatchesWithTag({ line, matchingRegex: CODE_REGEX, tag: 'code' });

  return line;
}

const lineHtmlTag = (line: string): [string, string] => {
  if (line[0] === '#') {
    const [, hTagValue, rest] = line.match(/(.*?)[^#](.*)/) as [string, string, string];
    const hTag = `h${hTagValue.length}`;
  
    return [hTag, rest];
  }

  return ['p', line];
}

const markdownToHtml = (markdown: string): string => {
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

@Component({
  standalone: true,
  selector: 'dev-post',
  template: `<div [innerHTML]="blogContent()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPostComponent {
  private routeParams: Signal<BlogPost | undefined>;

  blogContent = computed(() => markdownToHtml(this.routeParams()?.content || ''));

  constructor(activatedRoute: ActivatedRoute, meta: Meta) {
    const blogPostData = activatedRoute.data.pipe(
      startWith({ blogPost: {} }),
      map(data => <BlogPost>data.blogPost),
      tap(console.log),
      tap(({ title, description }) => {
        meta.updateTag({ name: 'title', content: title });
        meta.updateTag({ name: 'description', content: description });
      }),
    );
    this.routeParams = toSignal(blogPostData);
  }
}
