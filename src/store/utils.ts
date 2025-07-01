import { stringify as csvStringify } from "csv-stringify/browser/esm/sync";
import usePOSStore from "./pos";

export function downloadInstancesCsv(instanceId: string): void {
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
  const items = state.items.filter(
    (item) => item.instanceId === instanceId && !item.deleted
  );

  // Create the CSV header
  const header = [
    "datetime",
    ...items.map((item) => item.name),
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
