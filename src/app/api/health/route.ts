import { NextResponse } from "next/server";
export function GET() {
  return NextResponse.json({ status: "ok", component: "public-foundation" }, { headers: { "Cache-Control": "no-store" } });
}
