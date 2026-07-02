// Minimal zustand-like store with useSyncExternalStore
import { useRef, useSyncExternalStore } from "react";

type Listener = () => void;
type SetFn<T> = (partial: Partial<T> | ((s: T) => Partial<T>)) => void;
type GetFn<T> = () => T;
type Initializer<T> = (set: SetFn<T>, get: GetFn<T>) => T;

export type StoreApi<T> = {
  (): T;
  <U>(selector: (s: T) => U): U;
  getState: () => T;
  setState: SetFn<T>;
  subscribe: (l: (s: T) => void) => () => void;
};

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
    return true;
  }
  const ka = Object.keys(a as object); const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
  return true;
}

export function create<T extends object>(init: Initializer<T>): StoreApi<T> {
  let state: T;
  const listeners = new Set<Listener>();
  const setState: SetFn<T> = (partial) => {
    const next = typeof partial === "function" ? (partial as (s: T) => Partial<T>)(state) : partial;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  };
  const getState: GetFn<T> = () => state;
  state = init(setState, getState);

  function useStore(): T;
  function useStore<U>(selector: (s: T) => U): U;
  function useStore<U>(selector?: (s: T) => U): T | U {
    const cacheRef = useRef<{ state: T; value: T | U } | null>(null);
    const subscribe = (l: Listener) => { listeners.add(l); return () => { listeners.delete(l); }; };
    const getSnapshot = () => {
      const cache = cacheRef.current;
      if (cache && cache.state === state) return cache.value;
      const value = selector ? selector(state) : state;
      if (cache && shallowEqual(cache.value, value)) {
        cacheRef.current = { state, value: cache.value };
        return cache.value;
      }
      cacheRef.current = { state, value };
      return value;
    };
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot) as T | U;
  }

  const api = useStore as StoreApi<T>;
  api.getState = getState;
  api.setState = setState;
  api.subscribe = (l) => {
    const wrapped = () => l(state);
    listeners.add(wrapped);
    return () => { listeners.delete(wrapped); };
  };
  return api;
}
