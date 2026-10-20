// Historical authoring snapshots predate the explicit owner approval decisions.
// Compare every original field except the two intentionally updated documentation fields.
// Each content suite separately verifies the current exact owner tuple and null human/runtime fields.
export function priorAuthoringFields(rows:Record<string,unknown>[]) {
 return rows.map(row=>Object.fromEntries(Object.entries(row).filter(([key])=>!['draftStatus','finalOwnerApproval'].includes(key))));
}
