/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it } from "vitest";

import { createLocalStorageStore } from "@/hooks/use-local-storage-items";

describe("createLocalStorageStore", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("reads and writes items through localStorage", () => {
    const store = createLocalStorageStore<string>(
      () => JSON.parse(window.localStorage.getItem("test-items") ?? "[]") as string[],
      (items) => window.localStorage.setItem("test-items", JSON.stringify(items)),
      "test-items-change",
    );

    expect(store.getSnapshot()).toEqual([]);

    store.setItems(["a", "b"]);
    expect(store.getSnapshot()).toEqual(["a", "b"]);

    store.setItems((current) => [...current, "c"]);
    expect(store.getSnapshot()).toEqual(["a", "b", "c"]);
  });

  it("returns the same snapshot reference when storage data is unchanged", () => {
    const store = createLocalStorageStore<string>(
      () => JSON.parse(window.localStorage.getItem("test-items") ?? "[]") as string[],
      (items) => window.localStorage.setItem("test-items", JSON.stringify(items)),
      "test-items-change",
    );

    store.setItems(["a"]);
    const first = store.getSnapshot();
    const second = store.getSnapshot();

    expect(first).toBe(second);
  });

  it("returns an empty snapshot on the server", () => {
    const store = createLocalStorageStore<string>(
      () => ["client"],
      () => {},
      "server-items-change",
    );

    expect(store.getServerSnapshot()).toEqual([]);
  });
});
