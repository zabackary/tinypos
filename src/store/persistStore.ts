import { LOG_STORE_KEY } from "./log";
import usePOSStore, { type POSStoreState } from "./pos";

const LOCALSTORAGE_KEY = "tiny-pos-storage";
const ORIGIN_FS_FILE = "tiny-pos.json";

let hasLoaded = false;

export async function loadPersist() {
  const results = [loadFromLocalStorage(), await loadFromOriginFS()];
  let newest: StorageResult | null = null;
  for (const result of results) {
    if (
      result === null ||
      !result.state ||
      !Array.isArray(result.state.instances)
    )
      continue;
    if (newest === null || result.time >= newest.time) {
      newest = result;
    }
  }
  if (newest) {
    console.info("Restored from", newest.source);
    usePOSStore.setState(newest.state);
  }

  hasLoaded = true;

  if (!(await navigator.storage.persist())) {
    console.warn(
      "Could not persist storage. Under storage pressure, the data may be deleted."
    );
  }
}

export function subscribePersist(): () => void {
  return usePOSStore.subscribe((state, _prevState) => {
    if (!hasLoaded) {
      // If we haven't loaded the persisted state yet, skip persisting
      return;
    }
    persistToLocalStorage(state);
    // TODO: should we only flush to disk every once in a while?
    persistToOriginFS(state).catch((error) => {
      console.error("Failed to persist to OPFS:", error);
    });
  });
}

interface StorageResult {
  time: Date;
  state: POSStoreState;
  source: string;
}

function persistToLocalStorage(state: POSStoreState) {
  const serializedState = JSON.stringify({
    time: new Date().getTime(),
    state: {
      instances: state.instances,
      items: state.items,
      purchases: state.purchases,
      pin: state.pin,
      hasSeenWelcome: state.hasSeenWelcome,
    },
  });
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, serializedState);
  } catch (e) {
    console.error("Failed to persist to LocalStorage:", e);
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.error("Attempting to delete logs to free up space.");
      localStorage.removeItem(LOG_STORE_KEY);
      localStorage.setItem(LOCALSTORAGE_KEY, serializedState);
    }
  }
}

function loadFromLocalStorage(): StorageResult | null {
  const value = localStorage.getItem(LOCALSTORAGE_KEY);
  if (!value) return null;
  try {
    const { time, state } = JSON.parse(value);
    console.debug("From LocalStorage:", state);
    return {
      time: new Date(time),
      state,
      source: "LocalStorage",
    };
  } catch (_) {
    return null;
  }
}

async function persistToOriginFS(state: POSStoreState) {
  if (!navigator.storage || !navigator.storage.getDirectory) {
    console.warn("Origin File System API is not available.");
    return;
  }

  const time = new Date();
  const dir = await navigator.storage.getDirectory();
  const fileHandle = await dir.getFileHandle(ORIGIN_FS_FILE, {
    create: true,
  });
  const writable = await fileHandle.createWritable();
  // Delete the current file
  await writable.truncate(0);
  // Write the data
  await writable.write(
    JSON.stringify({
      time: time.getTime(),
      state: {
        instances: state.instances,
        items: state.items,
        purchases: state.purchases,
        pin: state.pin,
        hasSeenWelcome: state.hasSeenWelcome,
      },
    })
  );
  // Close the file
  await writable.close();
}

async function loadFromOriginFS(): Promise<StorageResult | null> {
  try {
    const dir = await navigator.storage.getDirectory();
    const fileHandle = await dir.getFileHandle(ORIGIN_FS_FILE);
    const file = await fileHandle.getFile();
    const text = await file.text();
    const { time, state } = JSON.parse(text);
    console.debug("From OPFS:", state);
    return {
      time: new Date(time),
      state,
      source: "OPFS",
    };
  } catch (_) {
    return null;
  }
}
