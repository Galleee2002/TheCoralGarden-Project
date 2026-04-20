import { beforeEach, describe, expect, it, vi } from "vitest";
import { encryptSettingValue } from "@/lib/settings-crypto";
import {
  CORREO_ARGENTINO_SETTING_KEYS,
  getCorreoArgentinoRuntimeSettings,
  getCorreoArgentinoSettings,
} from "../settings";

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    siteSetting: {
      findMany: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma/client");
const findManyMock = vi.mocked(prisma.siteSetting.findMany);
const originalEnv = process.env;

describe("Correo Argentino settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      SETTINGS_ENCRYPTION_KEY:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    };
  });

  it("keeps password values out of admin settings while exposing configured state", async () => {
    findManyMock.mockResolvedValue([
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.baseUrl,
        value: "https://correo.test",
      },
      { key: CORREO_ARGENTINO_SETTING_KEYS.apiUser, value: "api-user" },
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.apiPassword,
        value: encryptSettingValue("api-pass"),
      },
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.miCorreoEmail,
        value: "seller@example.com",
      },
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.miCorreoPassword,
        value: encryptSettingValue("seller-pass"),
      },
    ]);

    const settings = await getCorreoArgentinoSettings();

    expect(settings).toMatchObject({
      baseUrl: "https://correo.test",
      apiUser: "api-user",
      miCorreoEmail: "seller@example.com",
      apiPasswordConfigured: true,
      miCorreoPasswordConfigured: true,
    });
    expect(settings).not.toHaveProperty("apiPassword");
    expect(settings).not.toHaveProperty("miCorreoPassword");
  });

  it("decrypts Correo Argentino credentials for server-side runtime calls", async () => {
    findManyMock.mockResolvedValue([
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.baseUrl,
        value: "https://correo.test",
      },
      { key: CORREO_ARGENTINO_SETTING_KEYS.apiUser, value: "api-user" },
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.apiPassword,
        value: encryptSettingValue("api-pass"),
      },
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.miCorreoEmail,
        value: "seller@example.com",
      },
      {
        key: CORREO_ARGENTINO_SETTING_KEYS.miCorreoPassword,
        value: encryptSettingValue("seller-pass"),
      },
    ]);

    await expect(getCorreoArgentinoRuntimeSettings()).resolves.toMatchObject({
      baseUrl: "https://correo.test",
      apiUser: "api-user",
      apiPassword: "api-pass",
      miCorreoEmail: "seller@example.com",
      miCorreoPassword: "seller-pass",
    });
  });
});
