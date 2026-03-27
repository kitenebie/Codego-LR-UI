import { decryptLaravelPayload } from "@/src/components/tools/decryptPayload"

export {
  decryptLaravelPayload,
  getLaravelSecretKey,
  parseLaravelKey,
  parseLaravelEncryptedPayload,
} from "@/src/components/tools/decryptPayload"
export type { LaravelEncryptedPayload } from "@/src/components/tools/decryptPayload"

/**
 * Decrypt a Laravel-encrypted API response.
 *
 * Accepts either:
 *  - a raw encrypted string (the full response body)
 *  - an object with an `data` key holding the encrypted string
 *
 * @param response  Raw encrypted string or `{ data: string }` object
 * @param key       Optional Laravel APP_KEY (base64:… or raw). Falls back to VITE_LARAVEL_KEY.
 */
export function decryptResponse<T = unknown>(
  response: string | { data: string },
  key?: string
): T {
  const payload = typeof response === "string" ? response : response.data
  return decryptLaravelPayload<T>(payload, key)
}
