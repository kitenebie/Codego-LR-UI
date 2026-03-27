import { Playground } from "../components/playground"
import { DocsLayout, Section } from "../components/ui/toc"
import { PropsTable } from "../components/ui/props-table"

const TOC = [
  { id: "quick-start", label: "Quick Start" },
  { id: "setup", label: "Setup (CodegoApiProvider)" },
  { id: "configuration", label: "Configuration" },
  { id: "api-methods", label: "API Methods" },
  { id: "request-config", label: "Request Config" },
  { id: "notifications", label: "Notifications" },
  { id: "interceptors", label: "Interceptors" },
  { id: "typescript", label: "TypeScript Support" },
  { id: "storage", label: "Storage API" },
  { id: "props", label: "Props" },
]

export function APIDocs() {
  return (
    <DocsLayout toc={TOC}>
      {/* Quick Start */}
      <Section id="quick-start">
        <Playground
          title="CodeGo API - Quick Start"
          description="A lightweight HTTP client wrapper around Axios with built-in authentication interceptors."
          code={`import { api } from './lib/codego';

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', { name: 'John' });`}
        >
          <div className="text-center py-8 text-muted-foreground">
            <p>Install axios and configure your .env file</p>
            <p className="text-sm mt-2">VITE_API_URL=http://your-api-base-url.com/api</p>
          </div>
        </Playground>
      </Section>

      {/* Setup */}
      <Section id="setup">
        <Playground
          title="Setup — CodegoApiProvider"
          description="Toast notifications require CodegoApiProvider to be mounted inside ToastProvider. This wires up the toast function so onSuccessNotification and onErrorNotification work automatically."
          code={`import { ToastProvider } from '@juv/codego-react-ui'
import { CodegoApiProvider } from './lib/codego'

// main.tsx or App.tsx
function App() {
  return (
    <ToastProvider>
      <CodegoApiProvider>
        {/* your app */}
      </CodegoApiProvider>
    </ToastProvider>
  )
}

// Then in any component, notifications just work:
const Store = async () => {
  await api.post('/certificate', { name, description, price }, {
    onSuccessNotification: true,
    successNotifTitle: \`\${name} successfully Saved!\`,
    successNotifContent: \`The certificate: \${name} was created.\`,
    onErrorNotification: true,
  })
}`}
        >
          <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-warning space-y-2">
            <p className="font-semibold">⚠ Required for toast notifications</p>
            <p>
              Without <code className="font-mono bg-warning/10 px-1 rounded">CodegoApiProvider</code>, the toast
              function is <code className="font-mono bg-warning/10 px-1 rounded">null</code> and no notifications
              will appear — even if <code className="font-mono bg-warning/10 px-1 rounded">onSuccessNotification: true</code> is set.
            </p>
            <p className="font-semibold mt-1">Correct nesting order:</p>
            <pre className="font-mono bg-black/10 rounded p-2 whitespace-pre-wrap">{`<ToastProvider>          ← must be outer
  <CodegoApiProvider>    ← must be inside ToastProvider
    <App />
  </CodegoApiProvider>
</ToastProvider>`}</pre>
          </div>
        </Playground>
      </Section>

      {/* Configuration */}
      <Section id="configuration">
        <Playground
          title="Axios Instance Configuration"
          description="The base axios instance comes with default settings."
          code={`import { axiosInstance } from './lib/codego/axiosInstance';

// Default configuration
axiosInstance.defaults.baseURL   // VITE_API_URL or http://localhost/api
axiosInstance.defaults.timeout   // 10000ms (10 seconds)
axiosInstance.defaults.headers   // { Content-Type: 'application/json' }`}
        >
          <div className="text-left text-sm space-y-2 py-4">
            <div className="flex justify-between border-b pb-2">
              <span>baseURL</span>
              <code className="text-primary">VITE_API_URL or http://localhost/api</code>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>timeout</span>
              <code className="text-primary">10000ms</code>
            </div>
            <div className="flex justify-between">
              <span>headers</span>
              <code className="text-primary">application/json</code>
            </div>
          </div>
        </Playground>
      </Section>

      {/* API Methods */}
      <Section id="api-methods">
        <div className="space-y-8">
          <Playground
            title="GET Request"
            description="Fetch data from the server."
            code={`interface User {
  id: number;
  name: string;
  email: string;
}

const users = await api.get<User[]>('/users');
const user = await api.get<User>('/users/1', { 
  params: { include: 'profile' } 
});`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">GET /users</span>
              </div>
            </div>
          </Playground>

          <Playground
            title="POST Request"
            description="Create a new resource."
            code={`interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

const newUser = await api.post<CreateUserPayload, User>(
  '/users',
  { name: 'John', email: 'john@example.com', password: 'secret' }
);`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">POST /users</span>
              </div>
            </div>
          </Playground>

          <Playground
            title="PUT Request"
            description="Update an existing resource completely."
            code={`const updated = await api.put<User, User>(
  '/users/1',
  { name: 'John Updated', email: 'john.new@example.com' }
);`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">PUT /users/1</span>
              </div>
            </div>
          </Playground>

          <Playground
            title="PATCH Request"
            description="Partially update a resource."
            code={`// Partial update - only send fields that changed
const patched = await api.patch<{ name: string }, User>(
  '/users/1',
  { name: 'John Patched' }
);`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">PATCH /users/1</span>
              </div>
            </div>
          </Playground>

          <Playground
            title="DELETE Request"
            description="Remove a resource."
            code={`await api.delete('/users/1');

// With query parameters
await api.delete('/users', { 
  params: { force: true } 
});`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">DELETE /users/1</span>
              </div>
            </div>
          </Playground>
        </div>
      </Section>

      {/* Request Config */}
      <Section id="request-config">
        <Playground
          title="Request Configuration"
          description="The RequestConfig interface extends AxiosRequestConfig with additional options."
          code={`const config: RequestConfig<MyPayload> = {
  // Axios built-in options
  method: 'POST',
  url: '/api/users',
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
  params: { page: 1, limit: 10 },
  data: { name: 'John' },
  timeout: 5000,
  
  // CodeGo specific options
  skipAuth: false,  // Set to true to skip Bearer token
};`}
        >
          <div className="text-center py-4">
            <div className="p-4 rounded-lg bg-muted inline-block">
              <span className="text-muted-foreground">RequestConfig Options</span>
            </div>
          </div>
        </Playground>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">skipAuth Option</h3>
          <p className="text-muted-foreground mb-4">
            Use skipAuth: true for public endpoints that don't require authentication:
          </p>
          <Playground
            title="Skip Authentication"
            code={`// This request will NOT include the Authorization header
const publicData = await api.get('/public/data', {
  skipAuth: true
});

// This request WILL include the Authorization header
const privateData = await api.get('/private/data');`}
          >
            <div className="text-center py-4">
              <div className="flex gap-4">
                <span className="px-3 py-1 rounded bg-green-500/20 text-green-500 text-sm">With Auth</span>
                <span className="px-3 py-1 rounded bg-muted text-muted-foreground text-sm">skipAuth: true</span>
              </div>
            </div>
          </Playground>
        </div>
      </Section>

      {/* Notifications */}
      <Section id="notifications">
        <Playground
          title="Success Notification"
          description="Show a success toast notification after a successful request."
          code={`await api.post('/users', { name: 'John' }, {
  onSuccessNotification: true,
  successNotifTitle: 'User Created',
  successNotifContent: 'New user has been added successfully'
});`}
        >
          <div className="text-center py-4">
            <div className="p-4 rounded-lg bg-green-500/20 inline-block">
              <span className="text-green-500">Success Toast</span>
            </div>
          </div>
        </Playground>

        <div className="mt-8">
          <Playground
            title="Error Notification"
            description="Show an error toast notification when a request fails."
            code={`await api.get('/users/999', {
  onErrorNotification: true,
  errorNotifTitle: 'Fetch Failed',
  errorNotifContent: 'Unable to retrieve user data'
});`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-red-500/20 inline-block">
                <span className="text-red-500">Error Toast</span>
              </div>
            </div>
          </Playground>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Notification Options</h3>
          <PropsTable rows={[
            { prop: "onSuccessNotification", type: "boolean", default: "false", description: "Show success toast on successful request" },
            { prop: "successNotifTitle", type: "string", default: "'Success'", description: "Custom title for success notification" },
            { prop: "successNotifContent", type: "string", default: "'Operation completed successfully'", description: "Custom message for success notification" },
            { prop: "onErrorNotification", type: "boolean", default: "false", description: "Show error toast on failed request" },
            { prop: "errorNotifTitle", type: "string", default: "'Error'", description: "Custom title for error notification" },
            { prop: "errorNotifContent", type: "string", default: "'An error occurred'", description: "Custom message for error notification" },
          ]} />
        </div>
      </Section>

      {/* Interceptors */}
      <Section id="interceptors">
        <Playground
          title="Request Interceptor"
          description="Automatically adds Bearer token to requests."
          code={`axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.skipAuth) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);`}
        >
          <div className="text-center py-4">
            <div className="p-4 rounded-lg bg-muted inline-block">
              <span className="text-muted-foreground">Request → Token → Headers</span>
            </div>
          </div>
        </Playground>

        <div className="mt-8">
          <Playground
            title="Response Interceptor"
            description="Handles common HTTP errors."
            code={`axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.warn('Unauthorized - redirect login');
    }
    return Promise.reject(error);
  }
);`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">Response → Error Handler</span>
              </div>
            </div>
          </Playground>
        </div>
      </Section>

      {/* TypeScript Support */}
      <Section id="typescript">
        <Playground
          title="TypeScript Generics"
          description="Full TypeScript support with generic types for request and response."
          code={`// Generic syntax: api.<method><RequestType, ResponseType>(url, data?, config?)

// GET - only needs response type
api.get<ResponseType>(url, config)

// POST/PUT/PATCH - needs both request and response types
api.post<RequestType, ResponseType>(url, data, config)

// DELETE - only needs response type
api.delete<ResponseType>(url, config)`}
        >
          <div className="text-center py-4">
            <div className="p-4 rounded-lg bg-muted inline-block">
              <span className="text-muted-foreground">Type-Safe API Calls</span>
            </div>
          </div>
        </Playground>

        <div className="mt-8">
          <Playground
            title="Type Inference"
            description="TypeScript can infer types in many cases."
            code={`// TypeScript infers response type from the endpoint
const users = await api.get('/users'); // Promise<any>

// Explicit type for better IDE support
const users = await api.get<User[]>('/users'); // Promise<User[]>`}
          >
            <div className="text-center py-4">
              <div className="p-4 rounded-lg bg-muted inline-block">
                <span className="text-muted-foreground">Auto Type Inference</span>
              </div>
            </div>
          </Playground>
        </div>
      </Section>

      {/* Storage API */}
      <Section id="storage">
        <Playground
          title="Storage API"
          description="Zustand-based state management with persistence and optional auto-expiration."
          code={`import { createStore } from './core/storage/store';

// Create a persisted store with optional expiration
const { store, getStore } = createStore(
  { user: null },
  'user-session',
  30 * 60 * 1000 // 30 minutes expiration
);

// Use store in components
const { user, set } = store();
set({ user: { name: 'John' } });`}
        >
          <div className="text-center py-4">
            <div className="p-4 rounded-lg bg-muted inline-block">
              <span className="text-muted-foreground">State Persistence with Expiration</span>
            </div>
          </div>
        </Playground>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Storage Features</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Automatic localStorage persistence</li>
            <li>Optional auto-expiration (session timeout)</li>
            <li>Built-in <code>set</code> method for state updates</li>
            <li><code>getStore()</code> returns JSON string of current state</li>
          </ul>
        </div>
      </Section>

      {/* Props */}
      <Section id="props">
        <h2 className="text-2xl font-bold tracking-tight text-gradient mb-4">API Reference</h2>
        <p className="text-muted-foreground mb-6">Available methods and their signatures.</p>
        
        <PropsTable rows={[
          { prop: "api.get", type: "<R>(url: string, config?: RequestConfig) => Promise<R>", description: "Perform GET request", required: false },
          { prop: "api.post", type: "<T, R>(url: string, data?: T, config?: RequestConfig<T>) => Promise<R>", description: "Perform POST request", required: false },
          { prop: "api.put", type: "<T, R>(url: string, data?: T, config?: RequestConfig<T>) => Promise<R>", description: "Perform PUT request", required: false },
          { prop: "api.patch", type: "<T, R>(url: string, data?: T, config?: RequestConfig<T>) => Promise<R>", description: "Perform PATCH request", required: false },
          { prop: "api.delete", type: "<R>(url: string, config?: RequestConfig) => Promise<R>", description: "Perform DELETE request", required: false },
          { prop: "axiosInstance", type: "AxiosInstance", description: "Pre-configured axios instance", required: false },
          { prop: "RequestConfig", type: "interface", description: "Extends AxiosRequestConfig with skipAuth and notification options", required: false },
          { prop: "NotificationConfig", type: "interface", description: "onSuccessNotification, successNotifTitle, successNotifContent, onErrorNotification, errorNotifTitle, errorNotifContent", required: false },
          { prop: "setupInterceptors", type: "() => void", description: "Manually setup interceptors", required: false },
        ]} />
      </Section>
    </DocsLayout>
  )
}

export default APIDocs