import { create, StoreApi, UseBoundStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StoreWrapper<T extends object> = {
  store: UseBoundStore<StoreApi<T & { set: (val: Partial<T>) => void }>>;
  getStore: () => string;
};

/**
 * Create a universal Zustand store with optional auto-expire
 *
 * @param initialValue - Initial state object
 * @param sessionName - Key for localStorage persistence
 * @param expireInterval - Optional expiration in milliseconds
 */
export function createStore<T extends object>(
  initialValue: T,
  sessionName: string,
  expireInterval?: number
): StoreWrapper<T> {
  // Handle expiration
  if (expireInterval) {
    const expireKey = `${sessionName}_expires`;
    const now = Date.now();
    const storedExpire = localStorage.getItem(expireKey);

    if (storedExpire && now > parseInt(storedExpire)) {
      localStorage.removeItem(sessionName);
      localStorage.removeItem(expireKey);
    }

    localStorage.setItem(expireKey, (now + expireInterval).toString());
  }

  // Create Zustand store with persist
  const store = create<T & { set: (val: Partial<T>) => void }>()(
    persist(
      (set) => ({
        ...initialValue,
        set: (val: Partial<T>) => set((prev) => ({ ...prev, ...val })),
      }),
      {
        name: sessionName,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );

  // Return JSON string of current state (without set)
  const getStore = () => {
    const state = store.getState();
    const { set, ...rest } = state as any;
    return JSON.stringify(rest);
  };

  return { store, getStore };
}