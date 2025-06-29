import usePOSStore, { type Instance, type Item, type Purchase } from "./pos";

export interface InstanceStats {
  purchases: number;
  items: number;
}

export interface PurchasesStats {
  totalCount: number;
  totalRevenue: number;
  averageRevenue: number;
}

export function useInstance(id: string): Instance | undefined {
  return usePOSStore((store) => store.instances).filter(
    (instance) => instance.id === id
  )[0];
}

export function useItem(id: string): Item | undefined {
  return usePOSStore((store) => store.items).filter(
    (item) => item.id === id
  )[0];
}

export function usePurchase(id: string): Purchase | undefined {
  return usePOSStore((store) => store.purchases).filter(
    (purchase) => purchase.id === id
  )[0];
}

export function useInstances(): string[] {
  return usePOSStore((store) => store.instances).map((instance) => instance.id);
}

export function useItems(instanceId: string): string[] {
  return usePOSStore((store) => store.items)
    .filter((item) => item.instanceId === instanceId && !item.deleted)
    .map((item) => item.id);
}

export function useItemInfos(
  instanceId: string,
  includeDeleted: boolean = false
): Item[] {
  return usePOSStore((store) => store.items).filter(
    (item) =>
      item.instanceId === instanceId && (includeDeleted || !item.deleted)
  );
}

export function usePurchases(instanceId: string): string[] {
  return usePOSStore((store) => store.purchases)
    .filter(
      (purchase) => purchase.instanceId === instanceId && !purchase.deleted
    )
    .map((purchase) => purchase.id);
}

export function useItemStock(id: string): number | undefined {
  const items = usePOSStore((store) => store.items);
  const purchases = usePOSStore((store) => store.purchases);

  const item = items.filter((item) => item.id === id)[0];
  if (!item) return undefined;

  return purchases.reduce(
    (stock, purchase) =>
      stock -
      (purchase.instanceId === item.instanceId && !purchase.deleted
        ? purchase.items.reduce(
            (quantity, itemPurchase) =>
              quantity +
              (itemPurchase.itemId === id ? itemPurchase.quantity : 0),
            0
          )
        : 0),
    item.initialStock
  );
}

export function useInstanceStats(id: string): InstanceStats | undefined {
  const instances = usePOSStore((store) => store.instances);
  const items = usePOSStore((store) => store.items);
  const purchases = usePOSStore((store) => store.purchases);

  const instance = instances.filter((instance) => instance.id === id)[0];
  if (!instance) return undefined;

  return {
    items: items.filter((item) => item.instanceId === id && !item.deleted)
      .length,
    purchases: purchases.filter(
      (purchase) => purchase.instanceId === id && !purchase.deleted
    ).length,
  };
}

export function usePurchasesStats(
  instanceId: string
): PurchasesStats | undefined {
  const purchases = usePOSStore((store) => store.purchases).filter(
    (purchase) => purchase.instanceId === instanceId && !purchase.deleted
  );

  if (purchases.length === 0) return undefined;

  const totalRevenue = purchases.reduce(
    (total, purchase) => total + purchase.total,
    0
  );
  const averageRevenue = totalRevenue / purchases.length;

  return {
    totalCount: purchases.length,
    totalRevenue,
    averageRevenue,
  };
}

export function useInstanceItems(id: string): Item[] {
  return usePOSStore((store) => store.items).filter(
    (item) => item.instanceId === id && !item.deleted
  );
}
