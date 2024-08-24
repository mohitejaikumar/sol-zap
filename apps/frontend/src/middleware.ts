import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = token ? true : false;
    const pathSegments = req.nextUrl.pathname.split('/');

    if (!isAuthenticated && (pathSegments[1] == 'allZaps' || pathSegments[1] == 'zaps' )) {
        const loginPath = `/auth/signin/`;
        const loginURL = new URL(loginPath, req.nextUrl.origin);
        return NextResponse.redirect(loginURL.toString());
    }
    if ((isAuthenticated && pathSegments[2] == "signin") || (isAuthenticated && pathSegments[2] == "signup")) {
        const newURL = new URL("/allZaps", req.nextUrl.origin);
        return NextResponse.redirect(newURL.toString());
    }
    return NextResponse.next();
}