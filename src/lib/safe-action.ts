import { createSafeActionClient } from "next-safe-action";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const action = createSafeActionClient({
  handleServerError(e) {
    return e instanceof Error ? e.message : "Error interno del servidor";
  },
});

// Authenticated action client for admin server actions.
// Verifies the Supabase session server-side before executing the action.
export const adminAction = createSafeActionClient({
  handleServerError(e) {
    return e instanceof Error ? e.message : "Error interno del servidor";
  },
}).use(async ({ next }) => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("No autorizado");
  }

  return next({ ctx: { user } });
});
