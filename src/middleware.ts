import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['en', 'zh']; // Supported locales

// Function to determine the user's preferred locale from the Accept-Language header
function getPreferredLocale(req: NextRequest): string {
  const acceptLanguage = req.headers.get('accept-language');
  if (!acceptLanguage) return 'en'; // Default to 'en' if no header is present

  const preferredLocale = acceptLanguage.split(',')[0]; // Get the first preferred language
  return supportedLocales.includes(preferredLocale) ? preferredLocale : 'en'; // Fallback to 'en'
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect root '/' to the user's preferred locale or default locale ('/en')
  if (pathname === '/') {
    const preferredLocale = getPreferredLocale(req); // Determine user's preferred locale
    return NextResponse.redirect(new URL(`/${preferredLocale}`, req.url)); // Redirect to preferred locale
  }

  // Extract locale from the first segment of the path (e.g., '/en', '/zh')
  const locale = pathname.split('/')[1];

  // Redirect to default locale if the locale is not supported
  if (!supportedLocales.includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, req.url)); // Redirect to default '/en'
  }

  return NextResponse.next(); // Allow route processing if locale is valid
}

// Middleware config to match all paths except internal ones
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
