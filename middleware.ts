import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'ua'];
const defaultLocale = 'ua';
  
function getLocale(request: NextRequest): string {
  // Get the user's browser language preferences from the headers.
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Check if a locale preference is stored in the 'NEXT_LOCALE' cookie.
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie; // A saved cookie always wins.
  }

  // Find the best match between the browser's languages and your supported locales. Returns the best-supported locale or the default.
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the pathname is exactly '/', this will be handled by next.config.ts redirect.
  // Middleware will now only handle paths that are not the root and need locale prefixing.

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in pathname, rewrite to default locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.rewrite(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except internal Next.js paths and API routes
    // The root path '/' is now handled by next.config.ts redirect
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
