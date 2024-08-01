import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PB_USER_COLLECTION } from "@/lib/conts";
import { getNextjsCookie } from "@/lib/pocketbase/server-cookie";
import pb from "@/lib/pocketbase/pocketbase";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const request_cookie = request.cookies.get("pb_auth");
  const cookie = await getNextjsCookie(request_cookie);

  try {
    // Load the authentication model from the cookie if it exists
    if (cookie) {
      pb.authStore.loadFromCookie(cookie);
    } else {
      pb.authStore.clear();
    }
    
    // Verify and refresh the authentication model if it is valid
    if (pb.authStore.isValid) {
      await pb.collection(PB_USER_COLLECTION).authRefresh();
    } else {
      pb.authStore.clear();
    }
  } catch (error) {
    // Clear the auth store and update the response cookie on error will remove the cookie on browser
    pb.authStore.clear();
    response.headers.set(
      "set-cookie",
      pb.authStore.exportToCookie({ httpOnly: false })
    );
  }

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAuthenticated = !!pb.authStore.model;

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && !isAuthPage) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set(
      "next",
      request.nextUrl.pathname || "/dashboard/tasks"
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    const nextUrl = request.headers.get("next-url") || "/dashboard/tasks";
    const redirectUrl = new URL(nextUrl, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Proceed with the request
  return response;
}

// Apply the middleware to the specified routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
