import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    var auth = request.cookies.get("user");

    if (auth === undefined) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

export const config = {
    matcher: ["/", "/team/:id*", "/profile"],
};
