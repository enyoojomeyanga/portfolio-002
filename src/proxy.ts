import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./lib/supabase/env";
/** Session refresh on private routes; responses MUST NOT be publicly cached. */
export async function proxy(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const client = createServerClient(env.url, env.key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(changes) {
        changes.forEach(({name,value}) => request.cookies.set(name,value));
        response = NextResponse.next({request});
        changes.forEach(({name,value,options}) => response.cookies.set(name,value,options));
      },
    },
  });
  await client.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/studio/:path*"] };
