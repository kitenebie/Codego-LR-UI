import { create, StateCreator } from "zustand";
import { persist, PersistOptions, createJSONStorage } from "zustand/middleware";

type StoreConfig<T> = {
  name: string;
  persist?: boolean;
  persistOptions?: Partial<PersistOptions<T>>;
};

export const createStore = <T extends object>(
  initializer: StateCreator<T>,
  config: StoreConfig<T>
) => {
  const { name, persist: shouldPersist = true, persistOptions } = config;

  if (!shouldPersist) {
    return create<T>()(initializer);
  }

  return create<T>()(
    persist(initializer, {
      name,
      storage: createJSONStorage(() => localStorage),
      ...persistOptions,
    })
  );
};