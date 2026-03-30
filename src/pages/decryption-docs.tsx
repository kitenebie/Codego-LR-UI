import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { PropsTable } from "../components/ui/props-table"
import { Badge } from "../components/ui/badge"

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "setup",           label: "Setup" },
  { id: "decrypt-response",label: "decryptResponse" },
  { id: "low-level",       label: "Low-level Helpers" },
  { id: "with-api",        label: "Usage with api client" },
  { id: "laravel-setup",   label: "Laravel Setup" },
  { id: "examples",        label: "Usage Examples" },
  { id: "props",           label: "API Reference" },
]

export function DecryptionDocs() {
  return (
    <DocsLayout toc={TOC}>

      {/* Overview */}
      <Section id="overview">
        <Playground
          title="Laravel Response Decryption"
          description="Decrypt AES-256-CBC encrypted payloads produced by Laravel's encrypt() / Crypt::encrypt() helpers using crypto-js."
          code={`import { decryptResponse } from "@juv/codego-react-ui"

// Encrypted string straight from the API
const data = decryptResponse<User[]>(encryptedString)

// Or when the response wraps it in a { data: "..." } envelope
const data = decryptResponse<User[]>({ data: encryptedString })`}
        >
          <div className="flex flex-wrap gap-2 py-4">
            <Badge variant="info">AES-256-CBC</Badge>
            <Badge variant="outline">HMAC-SHA256 verified</Badge>
            <Badge variant="outline">PKCS7 padding</Badge>
            <Badge variant="success">crypto-js</Badge>
          </div>
        </Playground>
      </Section>

      {/* Setup */}
      <Section id="setup">
        <Playground
          title="Setup — Environment Key"
          description="The decryption key is read automatically from your environment. No manual wiring needed."
          code={`# .env
VITE_LARAVEL_KEY=base64:your_laravel_app_key_here

# The value is the same as APP_KEY in your Laravel .env`}
        >
          <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-warning space-y-1">
            <p className="font-semibold">⚠ Key resolution order</p>
            <ol className="list-decimal list-inside space-y-1">
              <li><code className="font-mono bg-warning/10 px-1 rounded">key</code> argument passed directly to the function</li>
              <li><code className="font-mono bg-warning/10 px-1 rounded">VITE_LARAVEL_KEY</code> environment variable</li>
              <li><code className="font-mono bg-warning/10 px-1 rounded">REACT_APP_LARAVEL_KEY</code> environment variable</li>
              <li><code className="font-mono bg-warning/10 px-1 rounded">window.__LARAVEL_KEY__</code> injected via Blade</li>
            </ol>
          </div>
        </Playground>
      </Section>

      {/* decryptResponse */}
      <Section id="decrypt-response">
        <div className="space-y-8">
          <Playground
            title="decryptResponse — string payload"
            description="Pass the raw encrypted string returned by the API."
            code={`import { decryptResponse } from "@juv/codego-react-ui"

const res = await fetch("/api/secret-data")
const encrypted = await res.text()

const users = decryptResponse<User[]>(encrypted)`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              Encrypted string → AES-256-CBC decrypt → parsed JSON
            </div>
          </Playground>

          <Playground
            title="decryptResponse — object envelope"
            description='When Laravel wraps the cipher in { "data": "..." }.'
            code={`const res = await fetch("/api/secret-data")
const json = await res.json() // { data: "eyJpdiI6..." }

const users = decryptResponse<User[]>(json)`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              {"{ data: \"eyJ...\" }"} → unwrap → decrypt → parsed JSON
            </div>
          </Playground>

          <Playground
            title="decryptResponse — inline key"
            description="Pass the key directly instead of relying on the environment variable."
            code={`const users = decryptResponse<User[]>(encrypted, "base64:your_key_here")`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              Useful for multi-tenant apps with per-tenant keys.
            </div>
          </Playground>
        </div>
      </Section>

      {/* Low-level helpers */}
      <Section id="low-level">
        <div className="space-y-8">
          <Playground
            title="decryptLaravelPayload"
            description="Core decrypt function. Verifies HMAC-SHA256 MAC before decrypting."
            code={`import { decryptLaravelPayload } from "@juv/codego-react-ui"

// Throws if MAC is invalid or decryption fails
const result = decryptLaravelPayload<MyType>(encryptedString, optionalKey)`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              MAC verification → AES-CBC decrypt → JSON.parse
            </div>
          </Playground>

          <Playground
            title="parseLaravelEncryptedPayload"
            description="Decode the base64 envelope into { iv, value, mac }."
            code={`import { parseLaravelEncryptedPayload } from "@juv/codego-react-ui"

const { iv, value, mac } = parseLaravelEncryptedPayload(encryptedString)
console.log(iv, value, mac)`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              base64 → JSON → LaravelEncryptedPayload
            </div>
          </Playground>

          <Playground
            title="parseLaravelKey"
            description='Convert a "base64:…" APP_KEY string into a CryptoJS WordArray.'
            code={`import { parseLaravelKey } from "@juv/codego-react-ui"

const wordArray = parseLaravelKey("base64:your_key_here")`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              Strips the "base64:" prefix and decodes to raw bytes.
            </div>
          </Playground>
        </div>
      </Section>

      {/* Usage with api client */}
      <Section id="with-api">
        <Playground
          title="Usage with the api client"
          description="Combine decryptResponse with the built-in api client for a clean one-liner."
          code={`import { api } from "@juv/codego-react-ui"
import { decryptResponse } from "@juv/codego-react-ui"

async function fetchSecretUsers() {
  // api returns the raw encrypted string
  const encrypted = await api.get<string>("/secret/users")
  return decryptResponse<User[]>(encrypted)
}

// Or inline
const users = decryptResponse<User[]>(
  await api.get<string>("/secret/users")
)`}
        >
          <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-xs text-info">
            <p className="font-semibold">💡 Tip</p>
            <p className="mt-1">
              The <code className="font-mono bg-info/10 px-1 rounded">api</code> client automatically attaches the Bearer token.
              Pair it with <code className="font-mono bg-info/10 px-1 rounded">decryptResponse</code> to handle auth + decryption in two lines.
            </p>
          </div>
        </Playground>
      </Section>

      {/* Laravel Setup */}
      <Section id="laravel-setup">
        <Playground
          title="Laravel — Encrypting the Response"
          description="Use Laravel's built-in Crypt facade or encrypt() helper to produce a compatible payload."
          code={`<?php
use Illuminate\\Support\\Facades\\Crypt;

// In your controller
return response()->json(
    Crypt::encrypt($yourData)   // returns the base64 envelope
);

// Or encrypt a collection / array
return response()->json(
    Crypt::encryptString(json_encode($collection))
);`}
        >
          <div className="rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-xs text-success space-y-1">
            <p className="font-semibold">✓ Compatible ciphers</p>
            <p>AES-128-CBC and AES-256-CBC (Laravel default). AEAD (GCM) is not supported.</p>
          </div>
        </Playground>
      </Section>

      {/* Detailed Usage Examples */}
      <Section id="examples">
        <h2 className="text-2xl font-bold tracking-tight text-gradient mb-4">Usage Examples</h2>

        <div className="space-y-8">
          {/* getLaravelSecretKey */}
          <Playground
            title="getLaravelSecretKey"
            description="Resolve the Laravel APP_KEY from the environment. Reads from VITE_LARAVEL_KEY, REACT_APP_LARAVEL_KEY, or window.__LARAVEL_KEY__ in that order."
            code={`import { getLaravelSecretKey } from "@juv/codego-react-ui"

// Automatically resolves from your environment
const key = getLaravelSecretKey()
console.log(key)
// => "base6:dGhpc19pc19hX3Rlc3Rfa2V5XzEyMzQ1Njc4OQ=="

// Throws if no key is configured
// Error: "Missing Laravel decryption key.
//   Set VITE_LARAVEL_KEY in your .env or inject
//   window.__LARAVEL_KEY__ via Blade."

// Useful when you need the key for other crypto operations
const key = getLaravelSecretKey()
const rawBytes = parseLaravelKey(key)
// Now use rawBytes for custom HMAC or encryption logic`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              Reads from env → returns raw key string → throws if missing
            </div>
          </Playground>

          {/* parseLaravelKey */}
          <Playground
            title="parseLaravelKey"
            description='Convert a Laravel APP_KEY string (base64:… or raw UTF-8) into a CryptoJS WordArray of raw bytes.'
            code={`import { parseLaravelKey } from "@juv/codego-react-ui"

// With base64: prefix (Laravel default)
const key1 = parseLaravelKey("base64:dGhpc19pc19hX3Rlc3Rfa2V5")
console.log(key1) // => CryptoJS WordArray (raw bytes)

// Without prefix (raw UTF-8 string)
const key2 = parseLaravelKey("my_raw_secret_key")
console.log(key2) // => CryptoJS WordArray (UTF-8 bytes)

// Verify key length (AES-256 expects 32 bytes)
const key3 = parseLaravelKey("base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
console.log(key3.sigBytes) // => 32

// Combine with getLaravelSecretKey for full resolution
const key = parseLaravelKey(getLaravelSecretKey())`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              "base64:…" → Base64.parse · raw string → Utf8.parse
            </div>
          </Playground>

          {/* parseLaravelEncryptedPayload */}
          <Playground
            title="parseLaravelEncryptedPayload"
            description="Decode a base64-encoded or raw JSON encrypted payload string into its component parts (iv, value, mac, tag)."
            code={`import { parseLaravelEncryptedPayload } from "@juv/codego-react-ui"
import type { LaravelEncryptedPayload } from "@juv/codego-react-ui"

// From a base64-encoded string (most common)
const payload: LaravelEncryptedPayload =
  parseLaravelEncryptedPayload("eyJpdiI6ImFiY2QiLCJ2YWx1ZSI6ImVmZ2giLCJtYWMiOiIxMjM0In0=")

console.log(payload.iv)    // => "abcd"  (Base64 IV)
console.log(payload.value) // => "efgh"  (Base64 ciphertext)
console.log(payload.mac)   // => "1234"  (HMAC-SHA256 hex)
console.log(payload.tag)   // => undefined (not AEAD)

// From a raw JSON string
const rawJson = '{"iv":"YWJjZA==","value":"ZWZnaA==","mac":"abc123"}'
const payload2 = parseLaravelEncryptedPayload(rawJson)

// Inspect payload to detect AEAD (unsupported)
if (payload.tag) {
  console.warn("AEAD cipher detected — use AES-CBC instead")
}`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              base64 string → decode → JSON.parse →{"{ iv, value, mac, tag? }"}
            </div>
          </Playground>

          {/* decryptLaravelPayload */}
          <Playground
            title="decryptLaravelPayload"
            description="Core decryption. Verifies the HMAC-SHA256 MAC to detect tampering, then AES-CBC decrypts and JSON-parses the result."
            code={`import { decryptLaravelPayload } from "@juv/codego-react-ui"

// Basic usage — key read from environment automatically
interface User {
  id: number
  name: string
  email: string
}

const users = decryptLaravelPayload<User[]>(encryptedString)

// With explicit key (e.g. multi-tenant)
const data = decryptLaravelPayload<MyData>(
  encryptedString,
  "base64:tenant_specific_key_here"
)

// Error handling
try {
  const result = decryptLaravelPayload<SensitiveData>(payload)
} catch (err) {
  if (err.message.includes("Invalid payload MAC")) {
    console.error("Wrong key or data tampered with")
  } else if (err.message.includes("AEAD tag")) {
    console.error("Unsupported cipher — Laravel must use AES-*-CBC")
  } else if (err.message.includes("empty plaintext")) {
    console.error("Decryption failed — likely wrong key")
  }
}

// Real-world: decrypt server-paginated table response
const response = await api.get<string>("/api/users?page=1")
const result = decryptLaravelPayload<{
  data: User[]
  total: number
  current_page: number
}>(response)

console.log(result.data)       // => User[]
console.log(result.total)      // => 150
console.log(result.current_page) // => 1`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              resolve key → parse payload → verify MAC → AES-CBC decrypt → JSON.parse
            </div>
          </Playground>

          {/* decryptResponse */}
          <Playground
            title="decryptResponse"
            description="High-level convenience wrapper. Accepts a raw string or { data: string } envelope and delegates to decryptLaravelPayload."
            code={`import { decryptResponse } from "@juv/codego-react-ui"

// Example 1: Raw encrypted string from fetch
const res = await fetch("/api/secret-users")
const encrypted = await res.text()
const users = decryptResponse<User[]>(encrypted)

// Example 2: JSON envelope { data: "..." }
const res = await fetch("/api/secret-users")
const json = await res.json() // { data: "eyJpdiI6..." }
const users = decryptResponse<User[]>(json)

// Example 3: With the api client
import { api } from "@juv/codego-react-ui"

const users = decryptResponse<User[]>(
  await api.get<string>("/secret/users")
)

// Example 4: Axios interceptor pattern
import axios from "axios"

const http = axios.create({ baseURL: "/api" })
http.interceptors.response.use((res) => {
  if (typeof res.data === "string") {
    res.data = decryptResponse(res.data)
  } else if (res.data?.data && typeof res.data.data === "string") {
    res.data = decryptResponse(res.data)
  }
  return res
})

// Now all responses are auto-decrypted
const { data: users } = await http.get<User[]>("/secret/users")

// Example 5: Explicit per-tenant key
const tenantKey = await fetchTenantKey(tenantId)
const config = decryptResponse<AppConfig>(encrypted, tenantKey)`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              string | {"{ data }"} → extract payload → decryptLaravelPayload → T
            </div>
          </Playground>

          {/* LaravelEncryptedPayload */}
          <Playground
            title="LaravelEncryptedPayload (type)"
            description="TypeScript type representing the decoded structure of a Laravel encrypted payload."
            code={`import type { LaravelEncryptedPayload } from "@juv/codego-react-ui"
import { parseLaravelEncryptedPayload } from "@juv/codego-react-ui"

// The shape of a parsed Laravel encrypted payload:
// {
//   iv:    string   — Base64-encoded initialization vector (16 bytes)
//   value: string   — Base64-encoded ciphertext
//   mac:   string   — HMAC-SHA256 hex digest for integrity verification
//   tag?:  string   — Present only for AEAD ciphers (unsupported)
// }

// Type-safe payload inspection
function validatePayload(raw: string): LaravelEncryptedPayload {
  const payload: LaravelEncryptedPayload =
    parseLaravelEncryptedPayload(raw)

  if (!payload.iv || !payload.value || !payload.mac) {
    throw new Error("Invalid Laravel payload: missing required fields")
  }

  if (payload.tag) {
    throw new Error(
      "AEAD cipher detected (tag present). " +
      "Only AES-CBC payloads are supported."
    )
  }

  return payload
}

// Use in custom decryption flow
const payload = validatePayload(encryptedString)
const key = parseLaravelKey(getLaravelSecretKey())
const expectedMac = CryptoJS.HmacSHA256(
  payload.iv + payload.value,
  key
).toString()

if (expectedMac !== payload.mac) {
  throw new Error("Integrity check failed")
}`}
          >
            <div className="text-center py-4 text-muted-foreground text-sm">
              {"{ iv: string, value: string, mac: string, tag?: string }"}
            </div>
          </Playground>
        </div>
      </Section>

      {/* API Reference */}
      <Section id="props">
        <h2 className="text-2xl font-bold tracking-tight text-gradient mb-4">API Reference</h2>

        <div className="space-y-8">
          <PropsTable rows={[
            { prop: "decryptResponse",              type: "<T>(response: string | { data: string }, key?: string) => T", required: false, description: "High-level helper. Accepts raw string or { data } envelope. Falls back to env key." },
            { prop: "decryptLaravelPayload",        type: "<T>(payload: string, key?: string) => T",                    required: false, description: "Core decrypt. Verifies HMAC-SHA256 MAC then AES-CBC decrypts." },
            { prop: "parseLaravelEncryptedPayload", type: "(payload: string) => LaravelEncryptedPayload",               required: false, description: "Decode base64 envelope to { iv, value, mac, tag? }." },
            { prop: "parseLaravelKey",              type: "(secretKey: string) => CryptoJS.lib.WordArray",              required: false, description: 'Parse "base64:…" or raw UTF-8 key string into CryptoJS bytes.' },
            { prop: "getLaravelSecretKey",          type: "() => string",                                               required: false, description: "Resolve key from VITE_LARAVEL_KEY / REACT_APP_LARAVEL_KEY / window.__LARAVEL_KEY__." },
          ]} />

          <div>
            <h3 className="text-lg font-semibold mb-3">LaravelEncryptedPayload</h3>
            <PropsTable rows={[
              { prop: "iv",    type: "string",           required: true,  description: "Base64-encoded initialization vector." },
              { prop: "value", type: "string",           required: true,  description: "Base64-encoded ciphertext." },
              { prop: "mac",   type: "string",           required: true,  description: "HMAC-SHA256 hex digest for integrity check." },
              { prop: "tag",   type: "string",           required: false, description: "Present only for AEAD ciphers (not supported)." },
            ]} />
          </div>
        </div>
      </Section>

    </DocsLayout>
  )
}
