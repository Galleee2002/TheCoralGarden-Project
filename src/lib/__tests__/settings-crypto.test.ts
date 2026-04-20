import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  decryptSettingValue,
  encryptSettingValue,
  isEncryptedSettingValue,
} from "@/lib/settings-crypto";

const originalEnv = process.env;

describe("settings crypto", () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      SETTINGS_ENCRYPTION_KEY:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("encrypts values without storing the plain text", () => {
    const encrypted = encryptSettingValue("correo-secret");

    expect(encrypted).not.toContain("correo-secret");
    expect(isEncryptedSettingValue(encrypted)).toBe(true);
    expect(decryptSettingValue(encrypted)).toBe("correo-secret");
  });

  it("requires SETTINGS_ENCRYPTION_KEY for encrypted settings", () => {
    delete process.env.SETTINGS_ENCRYPTION_KEY;

    expect(() => encryptSettingValue("correo-secret")).toThrow(
      "SETTINGS_ENCRYPTION_KEY"
    );
  });
});
