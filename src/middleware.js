import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/sign-in/(.*)?",
  "/sign-up",
  "/",
])

const isQstashWorkerRoute = createRouteMatcher([
  "/api/handleGenerateCaptions", 
  "/api/caption-result"
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingHomePage = currentUrl.pathname === "/";

  // Allow public routes (including QStash worker)
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  if (isQstashWorkerRoute(req)) {
    return NextResponse.next();
    }
  // If logged in, block access to public auth pages except home
  if (userId && currentUrl.pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If NOT logged in & trying to access a protected route → send to login
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

// ↓↓↓ ONLY THIS PART CHANGES ↓↓↓
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",

    // EXCLUDE the QStash worker route from middleware
    // (middleware will NOT run for this route)
  ],
};
