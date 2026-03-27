import CryptoJS from "crypto-js";

export type LaravelEncryptedPayload = {
  iv: string;
  value: string;
  mac: string;
  tag?: string;
};

export function getLaravelSecretKey(): string {
  const viteKey = (() => { try { return new Function("return import.meta.env")() as Record<string, string | undefined>; } catch { return undefined; } })()?.VITE_LARAVEL_KEY;
  const legacyKey = (globalThis as any)?.process?.env?.REACT_APP_LARAVEL_KEY as string | undefined;
  const windowKey = (globalThis as any)?.__LARAVEL_KEY__ as string | undefined;

  const key = viteKey || legacyKey || windowKey;
  if (!key) {
    throw new Error("Missing Laravel decryption key. Set VITE_LARAVEL_KEY in your .env or inject window.__LARAVEL_KEY__ via Blade.");
  }

  return key;
}

export function parseLaravelKey(secretKey: string): CryptoJS.lib.WordArray {
  if (secretKey.startsWith("base64:")) {
    return CryptoJS.enc.Base64.parse(secretKey.slice("base64:".length));
  }

  return CryptoJS.enc.Utf8.parse(secretKey);
}

export function parseLaravelEncryptedPayload(payload: string): LaravelEncryptedPayload {
  let jsonStr = payload;
  try {
    jsonStr = atob(payload);
  } catch {
    // not base64; treat as JSON string
  }

  return JSON.parse(jsonStr) as LaravelEncryptedPayload;
}

export function decryptLaravelPayload<T>(payload: string, secretKey?: string): T {
  const resolvedKey = secretKey ?? getLaravelSecretKey();
  const parsed = parseLaravelEncryptedPayload(payload);

  if (parsed.tag) {
    throw new Error("Unsupported Laravel cipher (AEAD tag present). Expected AES-*-CBC payload.");
  }

  const key = parseLaravelKey(resolvedKey);

  // Laravel computes: hash_hmac('sha256', iv + value, rawKeyBytes)
  // CryptoJS HmacSHA256 with a WordArray key uses the raw bytes correctly
  const expectedMac = CryptoJS.HmacSHA256(parsed.iv + parsed.value, key).toString(CryptoJS.enc.Hex);
  if (expectedMac !== parsed.mac) {
    throw new Error("Invalid payload MAC (wrong key or tampered payload).");
  }

  const iv = CryptoJS.enc.Base64.parse(parsed.iv);
  const ciphertext = CryptoJS.enc.Base64.parse(parsed.value);
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  if (!plaintext) {
    throw new Error("Decryption produced empty plaintext (wrong key/cipher).");
  }

  return JSON.parse(plaintext) as T;
}
