/**
 * Wrapper for zodResolver to handle Zod v4.3+ type incompatibility
 * with @hookform/resolvers v5. The runtime behavior is correct —
 * this only fixes a TypeScript overload resolution issue.
 */
import { zodResolver as _zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import type { Resolver } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function zodResolver<T extends ZodType<any>>(schema: T): Resolver<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _zodResolver(schema as any);
}
