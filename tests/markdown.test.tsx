import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownContent } from '../src/ui/MarkdownContent';

describe('question Markdown rendering', () => {
  it('renders GFM tables and fenced code without executing raw HTML', () => {
    const content = [
      '| Field | Meaning |',
      '| --- | --- |',
      '| ID | A long value |',
      '',
      '```text',
      '<script>alert(1)</script>',
      '```',
      '',
      '<img src=x onerror=alert(1)>',
    ].join('\n');
    const html = renderToStaticMarkup(<MarkdownContent>{content}</MarkdownContent>);
    expect(html).toContain('Scrollable content table');
    expect(html).toContain('<table>');
    expect(html).toContain('<pre>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
  });
});
