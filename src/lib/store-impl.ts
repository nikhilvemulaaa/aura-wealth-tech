// Minimal zustand-like store with useSyncExternalStore
import { useSyncExternalStore } from "react";

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
    const subscribe = (l: Listener) => { listeners.add(l); return () => { listeners.delete(l); }; };
    const getSnapshot = () => (selector ? selector(state) : state);
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
