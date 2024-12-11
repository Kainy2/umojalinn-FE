import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_PAGE_URL = "/";
const LOGIN_PAGE_URL = "/login";
const ONBOARDING_PAGE_URL = "/onboard";

const absoluteUrl = (relativeUrl: string, request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = relativeUrl;
  return url;
};

// Regular expression for matching guest routes
const guestRouteRegex =
  /^\/(login|register|confirm|verify-email\/.*|register\/verify)$/;
// Regular expression for matching shared routes
const sharedRouteRegex = /^\/privacy-policy$/;
// Regular expression for matching onboarding route
const onboardingRouteRegex = /^\/onboard$/;

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;
    const isUserLoggedIn = !!token;

    // Determine if the request is a guest route, shared route, or private route
    const isGuestRoute = guestRouteRegex.test(pathname);
    const isSharedRoute = sharedRouteRegex.test(pathname);
    const isOnboarding = onboardingRouteRegex.test(pathname);
    const isPrivateRoute = !(isGuestRoute || isSharedRoute);

    const hasOnboarded = !!token?.user?.hasOnboarded;

    // Handle private routes
    if (isPrivateRoute) {
      if (!isUserLoggedIn) {
        return NextResponse.redirect(
          absoluteUrl(LOGIN_PAGE_URL, request) + `?redirectTo=${pathname}`
        );
      } else if (!hasOnboarded && !isOnboarding) {
        return NextResponse.redirect(absoluteUrl(ONBOARDING_PAGE_URL, request));
      } else if (hasOnboarded && isOnboarding) {
        console.log(token, "TOKEN <<<");
        return NextResponse.redirect(
          absoluteUrl(
            `${ONBOARDING_PAGE_URL}/${token?.user?.profileRole?.toLocaleLowerCase()}`,
            request
          )
        );
      }
    }

    // Handle guest routes
    if (isUserLoggedIn && isGuestRoute) {
      return NextResponse.redirect(absoluteUrl(DASHBOARD_PAGE_URL, request));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

// Matcher Config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all items inside the public folder
     *    - images (public images)
     *    - next.svg (Next.js logo)
     *    - vercel.svg (Vercel logo)
     */
    "/((?!api|_next/static|_next/image|_next/img|favicon.ico|fonts|.+?/hook-examples|.+?/menu-examples|images|img|next.svg|vercel.svg).*)",
  ],
};
