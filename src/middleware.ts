import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_PAGE_URL = "/";
const LOGIN_PAGE_URL = "/login";

const absoluteUrl = (relativeUrl: string, request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = relativeUrl;

  return url;
};

const guestRoutes = [
  ".*/login.*",
  ".*/register.*",
  ".*/confirm.*",
  ".*/verify-email.*",
];

const sharedRoutes = [".*/privacy-policy$"];

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;
    const isUserLoggedIn = !!token;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function isRoutePattern(url: string) {
      const re = new RegExp(url);

      return re.test(pathname);
    }

    const isPrivateRoute = ![...guestRoutes, ...sharedRoutes].some(
      (routeRegex) => {
        const re = new RegExp(routeRegex);

        return re.test(pathname);
      }
    );
    const isRequestedRouteIsGuestRoute = guestRoutes.some((routeRegex) => {
      const re = new RegExp(routeRegex);

      return re.test(pathname);
    });

    if (isUserLoggedIn && isPrivateRoute) {
      if (!token?.user?.role && !isRoutePattern(".*/onboard$")) {
        return NextResponse.redirect(absoluteUrl("/onboard", request));
      } else if (token?.user?.role && isRoutePattern(".*/onboard$")) {
        return NextResponse.redirect(
          absoluteUrl(
            `/onboard/${token?.user?.role?.toLocaleLowerCase?.()}`,
            request
          )
        );
      }
    }

    if (!isUserLoggedIn && isPrivateRoute) {
      return NextResponse.redirect(
        absoluteUrl(LOGIN_PAGE_URL, request) + `?redirectTo=${pathname}`
      );
    }

    if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
      return NextResponse.redirect(absoluteUrl(DASHBOARD_PAGE_URL, request));
    }
  },
  {
    callbacks: {
      authorized: () => {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
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
