const DEFAULT_SITE_URL = "https://www.thecoralgarden.com.ar";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}
