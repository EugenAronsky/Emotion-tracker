// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "./lib/firebaseAdmin";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/entrance", req.url));
  }

  try {
    await adminAuth.verifyIdToken(token); // проверка токена
    return NextResponse.next(); // пользователь авторизован
  } catch (err) {
    return NextResponse.redirect(new URL("/entrance", req.url));
  }
}

// Какие пути защищаем

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!entrance|_next/static|_next/image|favicon.ico|api|.*\\.webp|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
