import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ENCRYPTED_PREFIX = "enc:v1:";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey() {
  const value = process.env.SETTINGS_ENCRYPTION_KEY?.trim();

  if (!value) {
    throw new Error(
      "Falta SETTINGS_ENCRYPTION_KEY para cifrar configuración sensible."
    );
  }

  const key = /^[a-f0-9]{64}$/i.test(value)
    ? Buffer.from(value, "hex")
    : Buffer.from(value, "base64");

  if (key.length !== 32) {
    throw new Error(
      "SETTINGS_ENCRYPTION_KEY debe tener 32 bytes en hex o base64."
    );
  }

  return key;
}

export function isEncryptedSettingValue(value: string | null | undefined) {
  return Boolean(value?.startsWith(ENCRYPTED_PREFIX));
}

export function encryptSettingValue(value: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${ENCRYPTED_PREFIX}${iv.toString("base64url")}:${tag.toString(
    "base64url"
  )}:${encrypted.toString("base64url")}`;
}

export function decryptSettingValue(value: string) {
  if (!isEncryptedSettingValue(value)) {
    return value;
  }

  const payload = value.slice(ENCRYPTED_PREFIX.length);
  const [ivValue, tagValue, encryptedValue] = payload.split(":");

  if (!ivValue || !tagValue || !encryptedValue) {
    throw new Error("Configuración cifrada inválida.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivValue, "base64url"),
    { authTagLength: AUTH_TAG_LENGTH }
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
