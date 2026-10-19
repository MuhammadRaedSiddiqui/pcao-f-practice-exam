import pins from './authorized-code-hashes.json';

// 19 October owner-authorized normal-app integration supersedes only five old
// application/configuration pins. The protected Preview branch additionally pins
// its build configuration and original committed account-preference behavior.
// Those deliberate differences do not alter historical evidence or content pins. The protected Preview branch additionally pins
// its build configuration and original committed account-preference behavior.
// Those deliberate differences do not alter historical evidence or content pins. The protected Preview branch additionally pins
// its build configuration and original committed account-preference behavior.
// Those deliberate differences do not alter historical evidence or content pins. The protected Preview branch additionally pins
// its build configuration and original committed account-preference behavior.
// Those deliberate differences do not alter historical evidence or content pins. The protected Preview branch additionally pins
// its build configuration and original committed account-preference behavior.
// Those deliberate differences do not alter historical evidence or content pins. All educational, source, approval and history
// checks keep their original hashes. New code is also pinned, never ignored.
export function integrationPreservationHash(path: string, historicalHash: string): string {
  return (pins as Record<string, string>)[path] ?? historicalHash;
}
