import type { Definition, PhrasingContent, Root, RootContent } from 'mdast';
import type { Content, ContentText, Style } from 'pdfmake/interfaces';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const parser = unified().use(remarkParse).use(remarkGfm);
export const reportWidth = 507.28; // A4 width minus the report's 44pt side margins.

/** Render Markdown as PDF text and tables; never execute HTML or fetch media. */
export function markdownToPdf(markdown: string, width = reportWidth): Content[] {
  const root = parser.parse(markdown) as Root;
  const definitions = new Map<string, Definition>();
  for (const node of root.children) {
    if (node.type === 'definition') definitions.set(node.identifier.toLowerCase(), node);
  }
  function inline(nodes: PhrasingContent[], style: Style = {}): ContentText[] {
    return nodes.flatMap(node => {
      if (node.type === 'strong') return inline(node.children, { ...style, bold: true });
      if (node.type === 'emphasis') return inline(node.children, { ...style, italics: true });
      if (node.type === 'delete') return inline(node.children, { ...style, decoration: 'lineThrough' });
      if (node.type === 'link' || node.type === 'linkReference') {
        const url = node.type === 'link' ? node.url : definitions.get(node.identifier.toLowerCase())?.url;
        return inline(node.children, style).map(part => /^(https?):\/\//i.test(url ?? '')
          ? { ...part, link: url, color: '#087d75', decoration: 'underline' as const } : part);
      }
      if (node.type === 'inlineCode') return [{ ...style, text: node.value, background: '#eef2f0' }];
      if (node.type === 'text' || node.type === 'html') return [{ ...style, text: node.value }];
      if (node.type === 'break') return [{ ...style, text: '\n' }];
      if (node.type === 'image' || node.type === 'imageReference') return [{ ...style, text: node.alt ?? 'Image' }];
      if (node.type === 'footnoteReference') return [{ ...style, text: `[${node.identifier}]` }];
      return [];
    });
  }
  function blocks(nodes: RootContent[], availableWidth: number): Content[] {
    return nodes.flatMap((node): Content[] => {
      switch (node.type) {
        case 'paragraph':
          return [{ text: inline(node.children), margin: [0, 0, 0, 8] }];
        case 'heading':
          return [{ text: inline(node.children), bold: true, fontSize: Math.max(11, 18 - node.depth),
            margin: [0, 10, 0, 6], headlineLevel: 2 }];
        case 'list': {
          const items = node.children.map(item => ({ stack: [
            ...(item.checked === null || item.checked === undefined ? [] : [{ text: item.checked ? '[x]' : '[ ]' }]),
            ...blocks(item.children, availableWidth - 16),
          ] }));
          return [node.ordered ? { ol: items, start: node.start ?? 1, margin: [0, 0, 0, 8] }
            : { ul: items, margin: [0, 0, 0, 8] }];
        }
        case 'blockquote':
          return [{ stack: blocks(node.children, availableWidth - 12), margin: [12, 2, 0, 8], color: '#526662' }];
        case 'code':
          return [{ text: node.value, fontSize: 9, preserveLeadingSpaces: true,
            background: '#eef2f0', margin: [0, 2, 0, 10] }];
        case 'table': {
          const columns = node.children[0]?.children.length ?? 0;
          if (!columns) return [];
          return [{ table: {
            headerRows: 1,
            dontBreakRows: true,
            widths: Array(columns).fill(availableWidth / columns - 12),
            body: node.children.map((row, index) => row.children.map((cell, column) => ({
              text: inline(cell.children), bold: index === 0, fillColor: index === 0 ? '#e8f3ef' : undefined,
              alignment: node.align?.[column] ?? 'left', fontSize: columns > 3 ? 9 : 10,
            }))),
          }, layout: {
            hLineWidth: () => 0.5, vLineWidth: () => 0,
            hLineColor: () => '#dce6e2', paddingLeft: () => 6, paddingRight: () => 6,
            paddingTop: () => 6, paddingBottom: () => 6,
          }, margin: [0, 2, 0, 12] }];
        }
        case 'thematicBreak':
          return [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: availableWidth, y2: 0,
            lineWidth: 0.5, lineColor: '#dce6e2' }], margin: [0, 6, 0, 12] }];
        case 'html':
          return [{ text: node.value, margin: [0, 0, 0, 8] }];
        case 'footnoteDefinition':
          return [{ text: `[${node.identifier}]`, bold: true }, ...blocks(node.children, availableWidth)];
        case 'definition':
          return [];
        default:
          return [];
      }
    });
  }
  return blocks(root.children, width);
}
