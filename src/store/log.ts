import { create } from "zustand";

export const LOG_STORE_KEY = "tiny-pos-logs";
const PERSIST_INTERVAL = 1000 * 60 * 2; // 2 minutes

export interface LogStoreState {
  logs: {
    timestamp: string;
    action: "delete" | "create" | "update";
    entity: "item" | "purchase" | "instance" | "pin" | "*";
    data: any;
  }[];
}

export interface LogStoreActions {
  addLog: (
    action: "delete" | "create" | "update",
    entity: "item" | "purchase" | "instance" | "pin" | "*",
    data: any
  ) => void;
}

export type LogStore = LogStoreState & LogStoreActions;

const useLogStore = create<LogStore>((set) => ({
  logs: [],

  addLog(action, entity, data = null) {
    set((state) => ({
      logs: [
        ...state.logs,
        {
          timestamp: new Date().toISOString(),
          action,
          entity,
          data,
        },
      ],
    }));
  },
}));

/**
 * Persists the logs to OPFS in a file named "tiny-pos-logs.json.gz".
 *
 * It stores the logs in a JSON format compressed with gzip, using the
 * CompressionStream API, combining them with the previous logs.
 */
export async function persistLogsToOPFS() {
  const logs = useLogStore.getState().logs;
  if (logs.length === 0) return;

  const fileHandle = await (
    await navigator.storage.getDirectory()
  ).getFileHandle("tiny-pos-logs.json.gz", { create: false });
  const file = await fileHandle.getFile();

  if (file.size > 0) {
    const oldLogs = await new Response(
      file.stream().pipeThrough(new DecompressionStream("gzip"))
    ).json();
    logs.unshift(...oldLogs);
  }

  const newText = new Blob([JSON.stringify(logs)], {
    type: "application/json",
  });
  newText
    .stream()
    .pipeThrough(new CompressionStream("gzip"))
    .pipeTo(await fileHandle.createWritable({ keepExistingData: false }));
}

let localStoragePersistedSlice: number = 0;

/**
 * Persists the logs to LocalStorage in a key named "tiny-pos-logs".
 *
 * It stores the logs in a JSON format.
 */
export function persistLogsToLocalStorage() {
  const logs = useLogStore.getState().logs.slice(localStoragePersistedSlice);
  localStoragePersistedSlice += logs.length;
  if (logs.length === 0) return;

  const oldLogs = localStorage.getItem("tiny-pos-logs");
  if (oldLogs) {
    try {
      const parsedLogs = JSON.parse(oldLogs);
      if (Array.isArray(parsedLogs)) {
        logs.unshift(...parsedLogs);
      }
    } catch (e) {
      console.error("Failed to parse existing logs from LocalStorage:", e);
    }
  }

  localStorage.setItem("tiny-pos-logs", JSON.stringify(logs));
}

export function setupLogPersistence() {
  setInterval(async () => {
    const state = useLogStore.getState();
    if (state.logs.length > 0) {
      try {
        persistLogsToLocalStorage();
      } catch (error) {
        console.error("Failed to persist logs to LocalStorage:", error);
      }
      try {
        await persistLogsToOPFS();
        localStoragePersistedSlice = 0;
        useLogStore.setState({ logs: [] }); // Clear logs after persisting
      } catch (error) {
        console.error("Failed to persist logs to OPFS:", error);
      }
      useLogStore.setState({ logs: [] }); // Clear logs after persisting
    }
  }, PERSIST_INTERVAL);
  useLogStore.subscribe((state) => {
    if (state.logs.length > 0) {
      persistLogsToLocalStorage();
    }
  });
}

/**
 * Retrieves the logs from LocalStorage or OPFS.
 */
export async function getLogs(
  fromOPFS: boolean = false
): Promise<LogStoreState["logs"]> {
  if (fromOPFS) {
    const dirHandle = await navigator.storage.getDirectory();
    const fileHandle = await dirHandle.getFileHandle("tiny-pos-logs.json.gz", {
      create: false,
    });
    const file = await fileHandle.getFile();
    const text = await new Response(
      file.stream().pipeThrough(new DecompressionStream("gzip"))
    ).text();
    return JSON.parse(text);
  } else {
    const logs = localStorage.getItem(LOG_STORE_KEY);
    return logs ? JSON.parse(logs) : [];
  }
}

export default useLogStore;
