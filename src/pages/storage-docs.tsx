import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { PropsTable } from "../components/ui/props-table"
import { Badge } from "../components/ui/badge"

const TOC = [
  { id: "basic", label: "Basic Usage" },
  { id: "with-expire", label: "With Expiration" },
  { id: "getstate", label: "Get State" },
  { id: "logout", label: "Logout/Clear" },
  { id: "props", label: "Parameters" },
]

/**
 * Storage API Documentation - store.ts
 * Universal Zustand store with optional auto-expire functionality
 */
export function StorageStoreDocs() {
  return (
    <DocsLayout toc={TOC}>
      <Section id="basic">
        <Playground 
          title="Basic Store" 
          description="Create a simple persisted store without expiration."
          code={`const { store, getStore } = createStore(
  { count: 0, name: 'demo' },
  'my-store'
);`}>
          <div className="p-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              The store persists to localStorage automatically. 
              Data survives page refreshes.
            </div>
            <Badge variant="info">Auto-persist enabled</Badge>
          </div>
        </Playground>
      </Section>

      <Section id="with-expire">
        <Playground 
          title="With Expiration" 
          description="Create a store that expires after specified time."
          code={`const { store } = createStore(
  { user: null },
  'user-session',
  30 * 60 * 1000 // 30 minutes
);`}>
          <div className="p-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              Store automatically clears when expiration time passes.
              Uses <code>{'{sessionName}_expires'}</code> key in localStorage.
            </div>
          <Badge variant="outline">Auto-expire</Badge>
              <Badge variant="outline">Session management</Badge>
          </div>
        </Playground>
      </Section>

      <Section id="getstate">
        <Playground 
          title="Get State" 
          description="Access and export current state as JSON."
          code={`// Get current state as JSON string
const stateJson = getStore();
console.log(stateJson); // {"count":0,"name":"demo"}`}>
          <div className="p-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              The <code>getStore()</code> method returns JSON string 
              without the internal <code>set</code> function.
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="logout">
        <Playground 
          title="Manual Clear / Logout" 
          description="Manually clear stored data (e.g., for logout)."
          code={`function logout() {
  localStorage.removeItem('user-session');
  localStorage.removeItem('user-session_expires');
}`}>
          <div className="p-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              When clearing an expired store, remove both the session key 
              and the expiration key.
            </div>
          </div>
        </Playground>
      </Section>

      <Section id="props">
        <PropsTable rows={[
          { prop: "initialValue", type: "T extends object", required: true, description: "Initial state object" },
          { prop: "sessionName", type: "string", required: true, description: "Key for localStorage persistence" },
          { prop: "expireInterval", type: "number", default: "optional", description: "Expiration time in milliseconds" },
        ]} />
      </Section>
    </DocsLayout>
  )
}