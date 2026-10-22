import i18n from "../i18n";
import useLogStore from "./log";
import { getStateVersion, migrateState } from "./migrate";
import usePOSStore, { type Item, type Purchase } from "./pos";

export class MergeError extends Error {
  humanMessage: string;
  constructor(message: string, humanMessage: string) {
    super(message);
    this.humanMessage = humanMessage;
    this.name = "MergeError";
  }
}

/** An exported instance file, already migrated to the current version. */
export interface MergeFile {
  /** The instance the file was exported from. */
  instance: { id: string; name: string };
  clientId: string;
  /** Epoch ms at which the file was exported. */
  exportedAt: number;
  items: Item[];
  purchases: Purchase[];
}

/**
 * A difference between a record in the file and the same record (same id)
 * already in the target instance. The user chooses which side to keep.
 */
export type MergeConflict =
  | { kind: "itemFields"; local: Item; remote: Item }
  | { kind: "itemDeleted"; local: Item; remote: Item }
  | { kind: "purchaseDeleted"; local: Purchase; remote: Purchase };

export type MergeResolution = "local" | "remote";

export interface MergePlan {
  targetInstanceId: string;
  file: MergeFile;
  /** The file's client was merged before, at or after this file's export time. */
  alreadyMerged: boolean;
  /** The file was exported from a different instance than the target. */
  instanceMismatch: boolean;
  newItems: Item[];
  newPurchases: Purchase[];
  conflicts: MergeConflict[];
  /**
   * New purchases whose line items (quantity x saved unit price) don't add up
   * to the purchase total. Suggests the file came from an older version.
   */
  inconsistentPurchaseIds: string[];
}

export function conflictKey(conflict: MergeConflict): string {
  return `${conflict.kind}:${conflict.local.id}`;
}

export function hasChanges(plan: MergePlan): boolean {
  return (
    plan.newItems.length > 0 ||
    plan.newPurchases.length > 0 ||
    plan.conflicts.length > 0
  );
}

/** Parses and validates the text of an exported instance file. */
export function parseMergeFile(text: string): MergeFile {
  const invalid = (detail: string) =>
    new MergeError(detail, i18n.t("store.importFailed"));
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw invalid(`Failed to parse merge file: ${error}`);
  }
  if (getStateVersion(data) < 2) {
    // Version 1 exports have no client ID or timestamps, so merging them
    // could not be made safe.
    throw new MergeError(
      "Merging files exported from state version 1 is not supported.",
      i18n.t("store.mergeUnsupportedVersion"),
    );
  }
  try {
    data = migrateState(data, {
      localClientId: usePOSStore.getState().clientId,
    });
  } catch (error) {
    throw invalid(`Failed to migrate merge file: ${error}`);
  }
  if (
    typeof data.instance?.id !== "string" ||
    typeof data.clientId !== "string" ||
    typeof data.exportedAt !== "number" ||
    !Array.isArray(data.items) ||
    !Array.isArray(data.purchases)
  ) {
    throw invalid("Merge file is missing required fields.");
  }
  return {
    instance: { id: data.instance.id, name: String(data.instance.name) },
    clientId: data.clientId,
    exportedAt: data.exportedAt,
    items: data.items,
    purchases: data.purchases,
  };
}

/** Works out what merging `file` into `targetInstanceId` would change. */
export function planMerge(
  file: MergeFile,
  targetInstanceId: string,
): MergePlan {
  const state = usePOSStore.getState();
  const localItems = new Map(state.items.map((item) => [item.id, item]));
  const localPurchases = new Map(
    state.purchases.map((purchase) => [purchase.id, purchase]),
  );

  const newItems: Item[] = [];
  const newPurchases: Purchase[] = [];
  const conflicts: MergeConflict[] = [];

  for (const remote of file.items) {
    const local = localItems.get(remote.id);
    if (!local) {
      newItems.push({ ...remote, instanceId: targetInstanceId });
      continue;
    }
    // An id that belongs to another instance isn't ours to modify.
    if (local.instanceId !== targetInstanceId) continue;
    if (local.name !== remote.name || local.price !== remote.price) {
      conflicts.push({ kind: "itemFields", local, remote });
    }
    if (local.deleted !== remote.deleted) {
      conflicts.push({ kind: "itemDeleted", local, remote });
    }
  }

  for (const remote of file.purchases) {
    const local = localPurchases.get(remote.id);
    if (!local) {
      newPurchases.push({ ...remote, instanceId: targetInstanceId });
      continue;
    }
    if (local.instanceId !== targetInstanceId) continue;
    if (local.deleted !== remote.deleted) {
      conflicts.push({ kind: "purchaseDeleted", local, remote });
    }
  }

  const inconsistentPurchaseIds = newPurchases
    .filter(
      (purchase) =>
        purchase.items.reduce(
          (sum, line) => sum + line.unitPrice * line.quantity,
          0,
        ) !== purchase.total,
    )
    .map((purchase) => purchase.id);

  return {
    targetInstanceId,
    file,
    instanceMismatch: file.instance.id !== targetInstanceId,
    alreadyMerged:
      (state.mergedClients[file.clientId] ?? -Infinity) >= file.exportedAt,
    newItems,
    newPurchases,
    conflicts,
    inconsistentPurchaseIds,
  };
}

/**
 * Applies a plan. `resolutions` maps `conflictKey` to the side to keep;
 * conflicts without an entry keep the local version.
 */
export function applyMerge(
  plan: MergePlan,
  resolutions: Record<string, MergeResolution>,
): void {
  const remoteItemFields = new Map<string, Item>();
  const remoteItemDeleted = new Map<string, boolean>();
  const remotePurchaseDeleted = new Map<string, boolean>();
  for (const conflict of plan.conflicts) {
    if (resolutions[conflictKey(conflict)] !== "remote") continue;
    switch (conflict.kind) {
      case "itemFields":
        remoteItemFields.set(conflict.local.id, conflict.remote);
        break;
      case "itemDeleted":
        remoteItemDeleted.set(conflict.local.id, conflict.remote.deleted);
        break;
      case "purchaseDeleted":
        remotePurchaseDeleted.set(conflict.local.id, conflict.remote.deleted);
        break;
    }
  }

  usePOSStore.setState((state) => ({
    items: [
      ...state.items.map((item) => {
        const fields = remoteItemFields.get(item.id);
        const deleted = remoteItemDeleted.get(item.id);
        return {
          ...item,
          ...(fields && { name: fields.name, price: fields.price }),
          ...(deleted !== undefined && { deleted }),
        };
      }),
      ...plan.newItems,
    ],
    purchases: [
      ...state.purchases.map((purchase) => {
        const deleted = remotePurchaseDeleted.get(purchase.id);
        return deleted === undefined ? purchase : { ...purchase, deleted };
      }),
      ...plan.newPurchases,
    ],
    mergedClients: {
      ...state.mergedClients,
      [plan.file.clientId]: Math.max(
        state.mergedClients[plan.file.clientId] ?? 0,
        plan.file.exportedAt,
      ),
    },
  }));
  useLogStore.getState().addLog("update", "instance", {
    id: plan.targetInstanceId,
    merge: {
      clientId: plan.file.clientId,
      exportedAt: plan.file.exportedAt,
      newItems: plan.newItems.length,
      newPurchases: plan.newPurchases.length,
      conflicts: plan.conflicts.length,
      resolutions,
    },
  });
}
