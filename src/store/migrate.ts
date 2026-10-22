/**
 * Bump `STATE_VERSION` whenever the shape of the persisted/exported state
 * changes, and add a migrator for the previous version to `migrators`.
 *
 * The same chain is used for both the local persisted store and for imported
 * or merged instance files; both contain `items` and `purchases` arrays.
 */
export const STATE_VERSION = 2;

interface MigrationContext {
  /** The client ID of this computer, used to fill in missing metadata. */
  localClientId: string;
}

/** Each migrator upgrades a state from version `n` to `n + 1`. */
const migrators: Record<number, (state: any, ctx: MigrationContext) => any> = {
  1: (state, { localClientId }) => {
    const items: any[] = Array.isArray(state.items) ? state.items : [];
    const priceOf = (itemId: string): number =>
      items.find((item) => item.id === itemId)?.price ?? 0;
    const purchases = (Array.isArray(state.purchases) ? state.purchases : []).map(
      (purchase: any) => {
        const parsed = Date.parse(purchase.date);
        return {
          ...purchase,
          clientId: purchase.clientId ?? localClientId,
          createdAt: Number.isNaN(parsed) ? 0 : parsed,
          items: purchase.items.map((line: any) => ({
            ...line,
            unitPrice: line.unitPrice ?? priceOf(line.itemId),
          })),
        };
      }
    );
    return { ...state, purchases };
  },
};

export class UnknownStateVersionError extends Error {
  version: unknown;
  constructor(version: unknown) {
    super(`Unknown state version: ${String(version)}`);
    this.version = version;
    this.name = "UnknownStateVersionError";
  }
}

/** Version of a persisted/exported blob; blobs without one predate versioning. */
export function getStateVersion(state: any): number {
  return typeof state?.stateVersion === "number" ? state.stateVersion : 1;
}

export function migrateState(state: any, ctx: MigrationContext): any {
  let version = getStateVersion(state);
  if (version > STATE_VERSION || !Number.isInteger(version) || version < 1) {
    throw new UnknownStateVersionError(version);
  }
  let current = state;
  while (version < STATE_VERSION) {
    current = migrators[version](current, ctx);
    version++;
  }
  return { ...current, stateVersion: STATE_VERSION };
}
