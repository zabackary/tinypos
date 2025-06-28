import usePOSStore from "./pos";

const KEY = "tiny-pos-storage";

export function persistToLocalStorage() {
  const { pin, instances, purchases, items } = usePOSStore.getState();
  const state = JSON.stringify({
    pin,
    instances,
    purchases,
    items,
  });
  localStorage.setItem(KEY, state);
}

export function loadFromLocalStorage(): boolean {
  const value = localStorage.getItem(KEY);
  if (!value) return false;
  try {
    usePOSStore.setState(JSON.parse(value));
  } catch (_) {
    return false;
  }
  return true;
}
