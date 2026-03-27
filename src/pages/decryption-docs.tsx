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
