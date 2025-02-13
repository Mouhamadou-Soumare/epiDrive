const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = 3;
const TIME_FRAME = 60 * 1000; 

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - entry.timestamp < TIME_FRAME) {
    entry.count += 1;
    if (entry.count > RATE_LIMIT) {
      return true;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
  }

  return false;
}
