import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

const storageFactory = () => {
  let store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store = new Map<string, string>();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

const localStorageMock = storageFactory();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock next/navigation (no Next.js runtime in Vitest)
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock next/image (avoid optimization errors)
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const rest = { ...props } as React.ImgHTMLAttributes<HTMLImageElement>;
    delete (rest as React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }).fill;
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
  localStorageMock.clear();
});
