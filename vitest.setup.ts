import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/navigation (no Next.js runtime in Vitest)
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock next/image (avoid optimization errors)
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { fill: _fill, ...rest } = props as React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean };
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", rest);
  },
}));

// Mock next/link to use a plain anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Clear mocks between tests
afterEach(() => {
  vi.clearAllMocks();
});
