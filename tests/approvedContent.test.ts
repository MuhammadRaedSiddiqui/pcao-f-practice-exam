import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import runtime from '../public/question-bank.json';

it('preserves every approved Markdown stem, option, order, ID and selection count', () => {
  const markdown = readFileSync(new URL('./fixtures/approved-question-content.md', import.meta.url), 'utf8');
  expect(createHash('sha256').update(markdown).digest('hex')).toBe('7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729');
  const headings = [...markdown.matchAll(/^## (Q\d+) — Select (ONE|exactly TWO|exactly THREE)\r?$/gm)];
  expect(headings).toHaveLength(60);
  headings.forEach((heading, index) => {
    const question = runtime.questions[index];
    const body = markdown.slice(heading.index! + heading[0].length, headings[index + 1]?.index ?? markdown.length);
    const optionMarkers = [...body.matchAll(/^\*\*([A-Z])\.\*\* /gm)];
    const stem = body.slice(0, optionMarkers[0].index).trim();
    const options = optionMarkers.map((marker, position) => ({
      id: marker[1],
      textMarkdown: body.slice(marker.index! + marker[0].length, optionMarkers[position + 1]?.index ?? body.length).trim(),
    }));
    expect(question.id).toBe(heading[1]);
    expect(question.selectionCount).toBe(heading[2] === 'ONE' ? 1 : heading[2] === 'exactly TWO' ? 2 : 3);
    expect(question.stemMarkdown, question.id + ' stem').toBe(stem);
    expect(question.options, question.id + ' options').toEqual(options);
  });
});
