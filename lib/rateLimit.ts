interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

export function rateLimit(identifier: string): boolean {
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
  
  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return true;
  }
  
  if (store[identifier].resetTime < now) {
    store[identifier] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return true;
  }
  
  if (store[identifier].count >= MAX_REQUESTS) {
    return false;
  }
  
  store[identifier].count++;
  return true;
}

export function getRateLimitInfo(identifier: string) {
  const info = store[identifier];
  if (!info) {
    return {
      remaining: MAX_REQUESTS,
      resetTime: Date.now() + WINDOW_MS,
    };
  }
  
  return {
    remaining: Math.max(0, MAX_REQUESTS - info.count),
    resetTime: info.resetTime,
  };
}
