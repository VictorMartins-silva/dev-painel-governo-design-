export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const duration = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, duration));
}
