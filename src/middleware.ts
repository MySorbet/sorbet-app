import { NextRequest, NextResponse } from 'next/server';

/**
 * In-memory rate limiter using LRU-style cache
 *
 * Tracks request counts per IP with automatic cleanup of expired entries.
 * This provides per-instance rate limiting - sufficient for page protection
 * since the backend API has its own rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMITS = {
  // Signin page - stricter limit to prevent brute force
  signin: { limit: 10, windowMs: 60 * 1000 },
  // General pages - more lenient
  default: { limit: 100, windowMs: 60 * 1000 },
};

// Maximum entries to prevent memory bloat
const MAX_STORE_SIZE = 10000;

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  // If still too large, remove oldest entries
  if (rateLimitStore.size > MAX_STORE_SIZE) {
    const entriesToRemove = rateLimitStore.size - MAX_STORE_SIZE;
    const keys = Array.from(rateLimitStore.keys()).slice(0, entriesToRemove);
    keys.forEach((key) => rateLimitStore.delete(key));
  }
}

/**
 * Check and update rate limit for a given key
 * @returns true if request should be allowed, false if rate limited
 */
function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Trigger cleanup periodically
  cleanupExpiredEntries();

  if (!entry || now > entry.resetTime) {
    // New window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (entry.count >= limit) {
    // Rate limited
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 * Handles various proxy configurations (Vercel, Cloud Run, nginx, etc.)
 */
function getClientIp(request: NextRequest): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first (client)
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Cloud Run specific
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback - this won't be accurate behind a proxy
  return 'unknown';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip rate limiting for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  const clientIp = getClientIp(request);

  // Determine which rate limit to apply
  const isSignin = pathname === '/signin' || pathname.startsWith('/signin');
  const { limit, windowMs } = isSignin
    ? RATE_LIMITS.signin
    : RATE_LIMITS.default;

  // Create a unique key combining IP and route type
  const rateLimitKey = `${clientIp}:${isSignin ? 'signin' : 'page'}`;

  const { allowed, remaining, resetTime } = checkRateLimit(
    rateLimitKey,
    limit,
    windowMs
  );

  if (!allowed) {
    // Return 429 Too Many Requests
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set(
    'X-RateLimit-Reset',
    String(Math.ceil(resetTime / 1000))
  );

  return response;
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
