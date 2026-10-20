// Rebuild the inventory from the validated frozen bank, without authoring guides.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
const root = 'docs/guided-practice/';
const evidence = 'test-results/guided-practice/phase-7-batch-1/';
const hash = x => createHash('sha256').update(x).digest('hex');
const raw = fs.readFileSync('public/easy-question-bank.json');
if (hash(raw) !== 'f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4') throw new Error('Bank drift');
const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { validateQuestionBank } = await vite.ssrLoadModule('/src/domain/bankValidation.ts');
  const { questionFingerprint } = await vite.ssrLoadModule('/src/domain/guided/fingerprints.ts');
  const valid = validateQuestionBank(JSON.parse(raw));
  if (!valid.ok) throw new Error(valid.errors.join('; '));
  const bank = valid.bank;
  const source = { schemaVersion: bank.schemaVersion, examId: bank.examId, bankVersion: bank.version, difficulty: 'intermediate' };
  const pilotIds = ['Q4','Q5','Q6','Q10','Q12','Q18','Q25','Q26','Q33','Q59'];
  const batch1 = bank.questions.filter(q => !pilotIds.includes(q.id)).slice(0, 10);
  const checked = new Set(batch1.flatMap(q => q.sources.map(s => s.url + '|' + s.sectionHeading)));
  const remaining = bank.questions.filter(q => !pilotIds.includes(q.id));
  if (remaining.length !== 50 || new Set(remaining.map(q => q.id)).size !== 50) throw new Error('Inventory mismatch');
  const records = [];
  for (const [i, q] of remaining.entries()) {
    const fp = await questionFingerprint(source, bank.domains.find(d => d.id === q.primaryDomain), q);
    if (!fp.ok) throw new Error(fp.code);
    const artifacts = [];
    if (/\|\s*:?-{3}/.test(q.stemMarkdown)) artifacts.push('embedded Markdown table');
    if (q.stemMarkdown.includes('```')) artifacts.push('fenced artifact');
    if (/^>/m.test(q.stemMarkdown)) artifacts.push('quoted policy/prompt/output');
    if (!artifacts.length) artifacts.push('prose scenario');
    if (/table/i.test(q.stemMarkdown) && !artifacts.includes('embedded Markdown table')) artifacts.push('table mentioned/requested, not embedded');
    records.push({ questionId: q.id, bankPosition: bank.questions.indexOf(q) + 1,
      domain: q.primaryDomain, domainTitle: bank.domains.find(d => d.id === q.primaryDomain).title,
      selectionCount: q.selectionCount, scenario: q.stemMarkdown.split(/(?<=\.)\s/)[0],
      format: q.selectionCount === 1 ? 'single-response' : 'multiple-response', artifacts,
      originalCorrectOptionIds: q.correctOptionIds, originalAnswerReference: 'public/easy-question-bank.json#/questions/' + bank.questions.indexOf(q) + '/correctOptionIds',
      sourceFingerprint: fp.value,
      sources: q.sources.map((s, sourceIndex) => ({ ...s, sourceIndex,
        availableEvidence: checked.has(s.url + '|' + s.sectionHeading) ? 'Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review' :
          'Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending' })),
      plannedBatch: Math.floor(i / 10) + 1,
      draftStatus: i < 10 ? 'planned-for-this-pass' : 'not-authored; owner Batch 1 approval required before continuation',
      independentHumanReview: 'pending', ownerApproval: 'pending' });
  }
  const batches = Array.from({ length: 5 }, (_, i) => {
    const qs = records.filter(q => q.plannedBatch === i + 1);
    return { batch: i + 1, questionIds: qs.map(q => q.questionId),
      domains: Object.fromEntries(bank.domains.map(d => [d.id, qs.filter(q => q.domain === d.id).length])),
      selectionCounts: Object.fromEntries([1,2,3].map(n => [n, qs.filter(q => q.selectionCount === n).length])),
      embeddedTables: qs.filter(q => q.artifacts.includes('embedded Markdown table')).map(q => q.questionId),
      otherArtifacts: qs.filter(q => q.artifacts.some(a => a !== 'prose scenario' && a !== 'embedded Markdown table')).map(q => ({ questionId: q.questionId, artifacts: q.artifacts })),
      sourceReferences: qs.reduce((n, q) => n + q.sources.length, 0),
      inspectedReferences: qs.reduce((n, q) => n + q.sources.filter(s => !s.availableEvidence.includes('source-pending')).length, 0),
      authoringDependencies: i === 0 ? 'This authorization; fixed schema/bank; inspect exact sources before final draft' : 'Owner Batch 1 approval and later batch continuation; inspect every remaining source-pending passage',
      gates: 'Per-item source evidence; schema/q1/draft-SHA/g1; independent solve-first/source/hints/options/set/arithmetic review; separate exact-digest owner approval; publication separately authorized' };
  });
  const inv = { authoringFormatVersion: 1, date: '2026-10-18', bankSha256: hash(raw), source, pilotIds,
    totals: { bank: 60, acceptedPilot: 10, remaining: 50,
      domainCounts: Object.fromEntries(bank.domains.map(d => [d.id, records.filter(q => q.domain === d.id).length])),
      selectionCounts: Object.fromEntries([1,2,3].map(n => [n, records.filter(q => q.selectionCount === n).length])) }, records };
  const table = '| Batch | Exact IDs in bank order | D1/D2/D3/D4/D5/D6/D7 | Select 1/2/3 | Embedded tables | Inspected/reference count |\n| --- | --- | --- | --- | --- | --- |\n' +
    batches.map(b => `| ${b.batch} | ${b.questionIds.join(', ')} | ${Object.values(b.domains).join('/')} | ${Object.values(b.selectionCounts).join('/')} | ${b.embeddedTables.join(', ') || 'None'} | ${b.inspectedReferences}/${b.sourceReferences} |`).join('\n');
  fs.writeFileSync(evidence + 'batch-distribution.md', table + '\n');
  fs.writeFileSync(root + 'PHASE-7-QUESTION-INVENTORY.md', '# Phase 7 — remaining Intermediate question inventory\n\n2026-10-18 (Asia/Karachi). Generated from the validated real bank, preserving its positions and ordering. SHA-256 verified: `' + hash(raw) + '`.\n\nExactly 50 unique remaining IDs; no overlap with the ten accepted pilot records. Full-bank domain totals remain 8/13/7/10/7/9/6; selection totals 48/10/2. Remaining totals are ' + Object.values(inv.totals.domainCounts).join('/') + ' by D1–D7 and ' + Object.values(inv.totals.selectionCounts).join('/') + ' by selections 1/2/3. Both triple-response items are already in the pilot.\n\n' + table + '\n\nThe JSON is the authoritative 50-row inventory, including exact keys (answer-bearing), source indices, q1, original positions, scenarios and formats. `source-pending` is not verified merely because its page was accessible. An inspected shared passage does not approve a later question’s teaching claims. Draft status here records initialization; current authoring/review status is in [content ledger](PHASE-7-CONTENT-LEDGER.md). No new guides are generated for Batches 2–5.\n\n```json\n' + JSON.stringify(inv, null, 2) + '\n```\n');
  fs.writeFileSync(evidence + 'batches.json', JSON.stringify(batches, null, 2) + '\n');
  console.log(table);
} finally { await vite.close(); }
