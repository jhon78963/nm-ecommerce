import { useCallback, useSyncExternalStore } from "react";

interface LocalStorageStore<T> {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => T[];
  getServerSnapshot: () => T[];
  setItems: (updater: T[] | ((current: T[]) => T[])) => void;
}

export function createLocalStorageStore<T>(
  read: () => T[],
  write: (items: T[]) => void,
  eventName: string,
): LocalStorageStore<T> {
  let cachedSerialized = "";
  let cachedSnapshot: T[] = [];

  function getSnapshot(): T[] {
    const next = read();
    const serialized = JSON.stringify(next);

    if (serialized === cachedSerialized) {
      return cachedSnapshot;
    }

    cachedSerialized = serialized;
    cachedSnapshot = next;
    return cachedSnapshot;
  }

  function notifyChange() {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(new Event(eventName));
  }

  return {
    subscribe(onStoreChange) {
      if (typeof window === "undefined") {
        return () => {};
      }

      const handler = () => onStoreChange();
      window.addEventListener(eventName, handler);
      window.addEventListener("storage", handler);

      return () => {
        window.removeEventListener(eventName, handler);
        window.removeEventListener("storage", handler);
      };
    },
    getSnapshot,
    getServerSnapshot: () => [],
    setItems(updater) {
      const current = getSnapshot();
      const next = typeof updater === "function" ? updater(current) : updater;
      write(next);

      cachedSerialized = JSON.stringify(next);
      cachedSnapshot = next;
      notifyChange();
    },
  };
}

export function useLocalStorageItems<T>(store: LocalStorageStore<T>) {
  const items = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const setItems = useCallback(
    (updater: T[] | ((current: T[]) => T[])) => {
      store.setItems(updater);
    },
    [store],
  );

  return { items, isHydrated, setItems };
}
