import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // In a real application, you would verify the JWT token here using next-auth
  // For the MVP, we just check if the path is protected.
  // Next-Auth v5 provides an auth() wrapper, but doing this manually in edge 
  // requires specific setup. We will use a basic path protection strategy.

  const protectedPaths = ['/dashboard', '/roadmap', '/tutor', '/exam', '/vocabulary', '/grammar', '/progress'];
  const path = request.nextUrl.pathname;

  // Assuming session cookie exists
  const hasSession = request.cookies.has('authjs.session-token') || request.cookies.has('__Secure-authjs.session-token');

  if (protectedPaths.some(p => path.startsWith(p)) && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect logged-in users away from auth pages
  if ((path.startsWith('/login') || path.startsWith('/register')) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
