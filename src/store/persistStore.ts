import usePOSStore, { type POSStoreState } from "./pos";

const KEY = "tiny-pos-storage";

export function setupPersist() {
  const localStorageState = loadFromLocalStorage();
  if (localStorageState) {
    usePOSStore.setState(localStorageState);
  }
  usePOSStore.subscribe((state, _prevState) => {
    persistToLocalStorage(state);
  });
}

export function persistToLocalStorage(state: POSStoreState) {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(KEY, serializedState);
}

export function loadFromLocalStorage(): POSStoreState | null {
  const value = localStorage.getItem(KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
}
