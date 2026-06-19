// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// const protectedRoutes = ["/profile", "/admin/dashboard"];

// export async function proxy(req: NextRequest) {
//   const { nextUrl } = req;
//   // check the existence of the session cookie to determine if the user is logged in or not, you can also do more complex checks here like verifying the cookie value with your backend if you want to be extra sure
//   const sessionCookie = getSessionCookie(req);

//   const res = NextResponse.next();

//   const isLoggedIn = !!sessionCookie;
//   const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
//   const isOnAuthRoute = nextUrl.pathname.startsWith("/auth");

//   if (isOnProtectedRoute && !isLoggedIn) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   if (isOnAuthRoute && isLoggedIn) {
//     return NextResponse.redirect(new URL("/profile", req.url));
//   }

//   return res;
// }

// // //match paths
// // // multiple paths
// // export const config = {
// //   matcher: ['/about/:path*', '/dashboard/:path*'],
// // };
// // // single path
// // export const config = {
// //   matcher: '/blog/:slug',
// // };
// // //or
// // //where do want to apply this proxy middleware? we can apply it to all routes, or just a subset of routes like /profile and /admin/*
// /*
// * Match all request paths except for the ones starting with:
// * - api (API routes)
// * - _next/static (static files)
// * - _next/image (image optimization files)
// * - favicon.ico (favicon file)
// * - sitemap.xml (sitemap file)
// * - robots.txt (robots file)
// */
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };
// // or better:
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Not signed in
  if (!session) {
    const signInUrl = new URL('/sign-in', request.url);

    signInUrl.searchParams.set(
      'callbackUrl',
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(signInUrl);
  }

  // Not an admin
  if (session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));

    // Alternatively:
    // return NextResponse.json(
    //   { message: "Forbidden" },
    //   { status: 403 }
    // );
  }
//   const result = await auth.api.userHasPermission({
//     body: {
//       userId: session.user.id,
//       permissions: {
//         admin: ['list'],
//       },
//     },
//     headers: request.headers,
//   });

//   if (!result.success) {
//     return NextResponse.redirect(new URL('/unauthorized', request.url));
//   }
  // to verify role directly:

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
