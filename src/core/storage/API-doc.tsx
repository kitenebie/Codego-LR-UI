/**
 * Storage API Library Documentation
 * 
 * A Zustand-based state management library with built-in persistence and optional
 * auto-expiration support for localStorage.
 * 
 * ## Installation
 * ```bash
 * npm install zustand
 * ```
 * 
 * ## Quick Start
 * ```tsx
 * import { createStore } from './core/storage/store';
 * 
 * // Create a store with auto-expire
 * const { store, getStore } = createStore(
 *   { count: 0, name: 'test' },
 *   'my-app-store',
 *   60000 // 1 minute expiration
 * );
 * 
 * // Use in components
 * const { count, set } = store();
 * set({ count: count + 1 });
 * ```
 * 
 * ---
 * 
 * ## Table of Contents
 * 1. [createStore (store.ts)](#createstore-store-ts)
 * 2. [createStore (createStore.ts)](#createStore-createStore-ts)
 * 3. [Types](#types)
 * 4. [Examples](#examples)
 * 
 * ---
 * 
 * ## createStore (store.ts)
 * 
 * A universal Zustand store with optional auto-expire functionality.
 * 
 * ```tsx
 * import { createStore } from './core/storage/store';
 * 
 * type StoreWrapper<T> = {
 *   store: UseBoundStore<StoreApi<T & { set: (val: Partial<T>) => void }>>;
 *   getStore: () => string;
 * };
 * 
 * const result = createStore<T>(
 *   initialValue: T,
 *   sessionName: string,
 *   expireInterval?: number
 * ): StoreWrapper<T>
 * ```
 * 
 * ### Parameters
 * 
 * | Parameter | Type | Required | Description |
 * |-----------|------|----------|-------------|
 * | `initialValue` | `T extends object` | Yes | Initial state object |
 * | `sessionName` | `string` | Yes | Key for localStorage persistence |
 * | `expireInterval` | `number` | No | Expiration time in milliseconds |
 * 
 * ### Returns
 * 
 * | Property | Type | Description |
 * |---------|------|-------------|
 * | `store` | `UseBoundStore` | Zustand store hook |
 * | `getStore` | `() => string` | Returns JSON string of current state |
 * 
 * ### Features
 * 
 * - **Automatic Persistence**: State is automatically saved to localStorage
 * - **Auto-Expire**: Optional expiration clears stored data after specified time
 * - **Built-in Setter**: Includes a `set` method for updating state
 * - **JSON Export**: `getStore()` returns current state as JSON string
 * 
 * ### Auto-Expiration
 * 
 * When `expireInterval` is provided, the store will:
 * 1. Store an expiration timestamp in `${sessionName}_expires` key
 * 2. Check expiration on store creation
 * 3. Clear both the store and expiration keys if expired
 * 
 * ```tsx
 * // Store expires in 5 minutes
 * const { store } = createStore(
 *   { user: null },
 *   'user-session',
 *   5 * 60 * 1000 // 300000ms
 * );
 * ```
 * 
 * ---
 * 
 * ## createStore (createStore.ts)
 * 
 * A simpler Zustand store creator with flexible persist options.
 * 
 * ```tsx
 * import { createStore } from './core/storage/createStore';
 * 
 * const store = createStore<T>(
 *   initializer: StateCreator<T>,
 *   config: StoreConfig<T>
 * ): UseBoundStore<StoreApi<T>>
 * ```
 * 
 * ### Parameters
 * 
 * | Parameter | Type | Required | Description |
 * |-----------|------|----------|-------------|
 * | `initializer` | `StateCreator<T>` | Yes | Zustand state creator function |
 * | `config` | `StoreConfig<T>` | Yes | Store configuration |
 * 
 * ### StoreConfig Type
 * 
 * ```tsx
 * type StoreConfig<T> = {
 *   name: string;                              // Required: localStorage key
 *   persist?: boolean;                         // Default: true - enable persistence
 *   persistOptions?: Partial<PersistOptions<T>>; // Custom persist options
 * };
 * ```
 * 
 * ### Returns
 * 
 * Returns a Zustand `UseBoundStore` that can be used as a hook.
 * 
 * ### Features
 * 
 * - **Flexible Configuration**: Control persistence behavior
 * - **Custom Storage**: Can extend persist options
 * - **No Expiration**: Simpler than store.ts version
 * - **State Creator Pattern**: Use Zustand's full API
 * 
 * ---
 * 
 * ## Types
 * 
 * ### AnyState
 * 
 * ```tsx
 * import { AnyState } from './core/storage/types';
 * 
 * type AnyState = Record<string, any>;
 * ```
 * 
 * Generic type for any state object.
 * 
 * ### StoreWrapper
 * 
 * ```tsx
 * type StoreWrapper<T extends object> = {
 *   store: UseBoundStore<StoreApi<T & { set: (val: Partial<T>) => void }>>;
 *   getStore: () => string;
 * };
 * ```
 * 
 * Return type for the store.ts createStore function.
 * 
 * ### StoreConfig
 * 
 * ```tsx
 * type StoreConfig<T> = {
 *   name: string;
 *   persist?: boolean;
 *   persistOptions?: Partial<PersistOptions<T>>;
 * };
 * ```
 * 
 * Configuration for createStore.ts version.
 * 
 * ---
 * 
 * ## Examples
 * 
 * ### Basic Counter (store.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/store';
 * 
 * interface CounterState {
 *   count: number;
 *   set: (val: Partial<CounterState>) => void;
 * }
 * 
 * const { store, getStore } = createStore<CounterState>(
 *   { count: 0 },
 *   'counter-store'
 * );
 * 
 * // In a component
 * function Counter() {
 *   const { count, set } = store();
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => set({ count: count + 1 })}>
 *         Increment
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ### User Session with Expiration (store.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/store';
 * 
 * interface UserState {
 *   user: { id: string; name: string } | null;
 *   set: (val: Partial<UserState>) => void;
 * }
 * 
 * // Session expires in 30 minutes
 * const { store, getStore } = createStore<UserState>(
 *   { user: null },
 *   'user-session',
 *   30 * 60 * 1000 // 1800000ms
 * );
 * 
 * // Login
 * function login(userData: { id: string; name: string }) {
 *   const { set } = store.getState();
 *   set({ user: userData });
 * }
 * 
 * // Logout
 * function logout() {
 *   const { set } = store.getState();
 *   set({ user: null });
 *   localStorage.removeItem('user-session');
 *   localStorage.removeItem('user-session_expires');
 * }
 * ```
 * 
 * ### Using createStore.ts (createStore.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/createStore';
 * 
 * interface CounterState {
 *   count: number;
 *   increment: () => void;
 *   decrement: () => void;
 * }
 * 
 * const useCounterStore = createStore<CounterState>(
 *   (set) => ({
 *     count: 0,
 *     increment: () => set((state) => ({ count: state.count + 1 })),
 *     decrement: () => set((state) => ({ count: state.count - 1 })),
 *   }),
 *   {
 *     name: 'counter-store',
 *     persist: true, // Enable persistence (default)
 *   }
 * );
 * 
 * // In a component
 * function Counter() {
 *   const { count, increment, decrement } = useCounterStore();
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={increment}>+</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ### Non-Persistent Store (createStore.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/createStore';
 * 
 * interface TempState {
 *   value: string;
 *   setValue: (val: string) => void;
 * }
 * 
 * // State is NOT persisted to localStorage
 * const useTempStore = createStore<TempState>(
 *   (set) => ({
 *     value: '',
 *     setValue: (value) => set({ value }),
 *   }),
 *   {
 *     name: 'temp-store',
 *     persist: false, // Disable persistence
 *   }
 * );
 * ```
 * 
 * ### Custom Storage Options (createStore.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/createStore';
 * import { persist, createJSONStorage, createSessionStorage } from 'zustand/middleware';
 * 
 * interface AppState {
 *   theme: 'light' | 'dark';
 *   setTheme: (theme: 'light' | 'dark') => void;
 * }
 * 
 * // Use sessionStorage instead of localStorage
 * const useAppStore = createStore<AppState>(
 *   (set) => ({
 *     theme: 'light',
 *     setTheme: (theme) => set({ theme }),
 *   }),
 *   {
 *     name: 'app-settings',
 *     persistOptions: {
 *       storage: createJSONStorage(() => sessionStorage),
 *     },
 *   }
 * );
 * ```
 * 
 * ### Cart with Expiration (store.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/store';
 * 
 * interface CartItem {
 *   id: string;
 *   name: string;
 *   price: number;
 *   quantity: number;
 * }
 * 
 * interface CartState {
 *   items: CartItem[];
 *   set: (val: Partial<CartState>) => void;
 *   addItem: (item: CartItem) => void;
 *   removeItem: (id: string) => void;
 *   clearCart: () => void;
 * }
 * 
 * // Cart expires in 1 hour
 * const { store, getStore } = createStore<CartState>(
 *   {
 *     items: [],
 *   },
 *   'shopping-cart',
 *   60 * 60 * 1000 // 1 hour
 * );
 * 
 * // Add cart actions
 * const addItem = (item: CartItem) => {
 *   const { items, set } = store.getState();
 *   const existing = items.find((i) => i.id === item.id);
 *   
 *   if (existing) {
 *     set({
 *       items: items.map((i) =>
 *         i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
 *       ),
 *     });
 *   } else {
 *     set({ items: [...items, { ...item, quantity: 1 }] });
 *   }
 * };
 * ```
 * 
 * ### Theme Store (createStore.ts)
 * 
 * ```tsx
 * import { createStore } from './core/storage/createStore';
 * 
 * type Theme = 'light' | 'dark' | 'system';
 * 
 * interface ThemeState {
 *   theme: Theme;
 *   setTheme: (theme: Theme) => void;
 * }
 * 
 * const useThemeStore = createStore<ThemeState>(
 *   (set) => ({
 *     theme: 'system' as Theme,
 *     setTheme: (theme) => set({ theme }),
 *   }),
 *   {
 *     name: 'theme-preference',
 *     persist: true,
 *   }
 * );
 * 
 * // Apply theme to document
 * function applyTheme(theme: Theme) {
 *   const root = document.documentElement;
 *   if (theme === 'system') {
 *     const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
 *       ? 'dark'
 *       : 'light';
 *     root.classList.toggle('dark', systemTheme === 'dark');
 *   } else {
 *     root.classList.toggle('dark', theme === 'dark');
 *   }
 * }
 * ```
 * 
 * ### Multiple Stores
 * 
 * ```tsx
 * import { createStore } from './core/storage/store';
 * import { createStore as createSimpleStore } from './core/storage/createStore';
 * 
 * // Using store.ts (with expiration)
 * const userStore = createStore(
 *   { user: null },
 *   'user-store',
 *   24 * 60 * 60 * 1000 // 24 hours
 * );
 * 
 * // Using createStore.ts (simpler)
 * const settingsStore = createSimpleStore(
 *   (set) => ({
 *     language: 'en',
 *     setLanguage: (lang: string) => set({ language: lang }),
 *   }),
 *   { name: 'settings-store' }
 * );
 * 
 * // In component
 * function App() {
 *   const { user } = userStore.store();
 *   const { language, setLanguage } = settingsStore();
 *   
 *   return (
 *     <div>
 *       <p>User: {user?.name}</p>
 *       <p>Language: {language}</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ---
 * 
 * ## Comparison: store.ts vs createStore.ts
 * 
 * | Feature | store.ts | createStore.ts |
 * |---------|----------|----------------|
 * | Persistence | ✅ Always | ✅ Configurable |
 * | Expiration | ✅ Built-in | ❌ Not supported |
 * | State Creator | Simple object | Full Zustand API |
 * | Custom Middleware | Limited | Full support |
 * | Set Method | Auto-generated | Manual |
 * | useSyncExternalStore | ✅ Compatible | ✅ Compatible |
 * 
 * ---
 * 
 * ## Best Practices
 * 
 * 1. **Use store.ts** when you need auto-expiration for session data
 * 2. **Use createStore.ts** for complex state logic with actions
 * 3. **Type your state** for better IDE support
 * 4. **Use descriptive names** for localStorage keys
 * 5. **Handle expiration cleanup** manually for logout flows
 * 6. **Consider sessionStorage** for sensitive temporary data
 * 
 * ---
 * 
 * ## API Reference
 * 
 * ### store.ts exports
 * 
 * | Export | Type | Description |
 * |--------|------|-------------|
 * | `createStore` | `(T, string, number?) => StoreWrapper<T>` | Create store with optional expiration |
 * | `StoreWrapper` | `object` | Return type with store and getStore |
 * 
 * ### createStore.ts exports
 * 
 * | Export | Type | Description |
 * |--------|------|-------------|
 * | `createStore` | `(StateCreator<T>, StoreConfig<T>) => UseBoundStore` | Create configurable store |
 * | `StoreConfig` | `object` | Configuration interface |
 * 
 * ### types.ts exports
 * 
 * | Export | Type | Description |
 * |--------|------|-------------|
 * | `AnyState` | `Record<string, any>` | Generic state type |
 * 
 * ---
 * 
 * ## Source Files
 * 
 * - [store.ts](./store.ts) - Universal store with auto-expire
 * - [createStore.ts](./createStore.ts) - Simple configurable store
 * - [types.ts](./types.ts) - TypeScript type definitions
 */

export const StorageAPIDocumentation = null;