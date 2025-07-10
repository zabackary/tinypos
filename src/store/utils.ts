import { stringify as csvStringify } from "csv-stringify/browser/esm/sync";
import usePOSStore, { EXPORT_STATE_VERSION } from "./pos";

export function downloadInstanceCsv(instanceId: string): void {
  const text = purchasesToCsv(instanceId);
  const blob = new Blob([text], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `purchases-${
    usePOSStore.getState().instances.find((i) => i.id === instanceId)?.name
  }-${new Date().toISOString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportInstance(instanceId: string): void {
  const state = usePOSStore.getState();
  const instance = state.instances.find((i) => i.id === instanceId);
  if (!instance) {
    console.error(`Instance with ID ${instanceId} not found.`);
    return;
  }
  const items = state.items.filter((item) => item.instanceId === instanceId);
  const purchases = state.purchases.filter(
    (purchase) => purchase.instanceId === instanceId
  );
  const data = {
    instance,
    items,
    purchases,
    stateVersion: EXPORT_STATE_VERSION,
  };
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${
    instance.name
  }-${new Date().toISOString()}.tinyposinstance.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export class InstanceImportError extends Error {
  humanMessage: string;
  constructor(message: string, humanMessage: string) {
    super(message);
    this.humanMessage = humanMessage;
    this.name = "InstanceImportError";
  }
}

const versionMappings: Record<number, (state: any) => any> = {
  1: (state: any) => {
    // Migrate from version 1 to 1
    return state;
  },
};

export async function importInstance(): Promise<string> {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.click();
  const id = await new Promise<string>((resolve, reject) => {
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const text = await file.text();
        try {
          let data = JSON.parse(text);
          const state = usePOSStore.getState();
          // Migrate the state
          data = versionMappings[data.stateVersion as number](data);
          // Check if the instance already exists
          const existingInstance = state.instances.find(
            (i) => i.id === data.instance.id
          );
          if (existingInstance) {
            reject(
              new InstanceImportError(
                `Instance with ID ${data.instance.id} already exists.`,
                `このインスタンスはもう存在します。削除してからまた試してください。`
              )
            );
            return;
          }
          usePOSStore.setState((state) => {
            return {
              instances: [...state.instances, data.instance],
              items: [
                ...state.items,
                ...data.items.map((item: any) => ({
                  ...item,
                  instanceId: data.instance.id,
                })),
              ],
              purchases: [
                ...state.purchases,
                ...data.purchases.map((purchase: any) => ({
                  ...purchase,
                  instanceId: data.instance.id,
                })),
              ],
            };
          });
          resolve(data.instance.id);
        } catch (error) {
          reject(
            new InstanceImportError(
              `Failed to parse instance data: ${error}`,
              "インスタンスを読み取ることに失敗しました"
            )
          );
        }
      } else {
        reject(
          new InstanceImportError(
            "No file selected",
            "ファイルが選択されていません"
          )
        );
      }
    };
  });
  input.remove();
  return id;
}

/**
 * Construct a CSV from the purchases in the form of:
 *
 * datetime,product1,product2,...,productn,total,paid,change
 *
 */
export function purchasesToCsv(instanceId: string): string {
  const state = usePOSStore.getState();
  // Get all purchases that are not deleted
  const purchases = state.purchases.filter(
    (purchase) => purchase.instanceId === instanceId && !purchase.deleted
  );
  // Get all items
  const items = state.items.filter((item) => item.instanceId === instanceId);

  // Create the CSV header
  const header = [
    "datetime",
    ...items.map((item) => {
      if (item.deleted) return `${item.name} (削除された)`;
      return item.name;
    }),
    "total",
    "paid",
    "change",
  ];

  // Create the CSV rows
  const rows = purchases.map((purchase) => {
    const itemQuantities = items.map((item) => {
      const quantity =
        purchase.items.find((p) => p.itemId === item.id)?.quantity || 0;
      return quantity.toString();
    });
    // TODO: if we every support USD, we should format these as currency appropriately
    const total = purchase.total.toString();
    const paid = purchase.paid.toString();
    const change = (purchase.paid - purchase.total).toString();

    return [purchase.date, ...itemQuantities, total, paid, change];
  });

  return csvStringify([header, ...rows]);
}
