import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PropsWithChildren, ReactNode } from 'react';

// Keep component identities stable so timer updates retain table focus and scroll.
const markdownComponents: Components = {
  table({ children: tableContent }: { children?: ReactNode }) {
    return <div className="table-scroll" role="region" aria-label="Scrollable content table" tabIndex={0}>
      <table>{tableContent}</table>
    </div>;
  },
  a({ children: linkContent, href }: { children?: ReactNode; href?: string }) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{linkContent}</a>;
  },
};

export function MarkdownContent({ children }: PropsWithChildren<{ children: string }>) {
  return <div className="markdown">
    <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{children}</Markdown>
  </div>;
}
