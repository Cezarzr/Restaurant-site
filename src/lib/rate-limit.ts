const requestMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const item = requestMap.get(key);
  if (!item || item.resetAt < now) {
    requestMap.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (item.count >= max) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((item.resetAt - now) / 1000) };
  }
  item.count += 1;
  requestMap.set(key, item);
  return { ok: true, remaining: max - item.count };
}
