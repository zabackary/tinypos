import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import useLogStore from "./log";

/**
 * An item represents
 */
export interface Item {
  id: string;
  instanceId: string;

  name: string;
  price: number;
  initialStock: number;

  deleted: boolean;
}

export interface Purchase {
  id: string;
  instanceId: string;

  date: string;
  items: {
    itemId: string;
    quantity: number;
  }[];

  total: number;
  paid: number;

  deleted: boolean;
}

export interface Instance {
  id: string;
  name: string;

  date: string;
}

// When updating this store, make sure to also update the
// `persistStore.ts` to ensure the state is persisted correctly.
export const EXPORT_STATE_VERSION = 1;
export interface POSStoreState {
  pin: string | null;
  hasSeenWelcome: boolean;
  instances: Instance[];
  items: Item[];
  purchases: Purchase[];
}

export interface POSStoreActions {
  reset(): void;

  setHasSeenWelcome(hasSeen: boolean): void;

  setPin(newPin: string | null): void;

  createInstance(name: string): string;
  createPurchase(
    instanceId: string,
    items: {
      itemId: string;
      quantity: number;
    }[],
    total: number,
    paid: number
  ): string;
  createItem(
    instanceId: string,
    name: string,
    initialStock: number,
    price: number
  ): string;

  updateItem(
    id: string,
    name: string,
    initialStock: number,
    price: number
  ): void;

  deletePurchase(id: string): void;
  deleteItem(id: string): void;
  deleteInstance(id: string): void;
}

export type POSStore = POSStoreState & POSStoreActions;

const usePOSStore = create<POSStore>((set) => ({
  pin: null,
  instances: [],
  items: [],
  purchases: [],
  hasSeenWelcome: false,

  reset() {
    set({
      pin: null,
      instances: [],
      items: [],
      purchases: [],
      // hasSeenWelcome: false, (we don't reset this to avoid showing the welcome screen again)
    });
    useLogStore.getState().addLog("delete", "*", "reset");
  },

  setPin(newPin) {
    set({
      pin: newPin,
    });
    useLogStore.getState().addLog("update", "pin", { newPin });
  },

  createInstance(name) {
    const id = uuidv4();
    set((store) => ({
      instances: [
        ...store.instances,
        {
          id,
          name,
          date: new Date().toLocaleString(),
        },
      ],
    }));
    useLogStore.getState().addLog("create", "instance", { id, name });
    return id;
  },
  createPurchase(instanceId, items, total, paid) {
    const id = uuidv4();
    set((store) => ({
      purchases: [
        ...store.purchases,
        {
          id,
          instanceId,

          date: new Date().toLocaleString(),
          items,

          total,
          paid,

          deleted: false,
        },
      ],
    }));
    useLogStore
      .getState()
      .addLog("create", "purchase", {
        id,
        instanceId,
        date: new Date().toLocaleString(),
        items,
        total,
        paid,
      });
    return id;
  },
  createItem(instanceId, name, initialStock, price) {
    const id = uuidv4();
    set((store) => ({
      items: [
        ...store.items,
        {
          id,
          instanceId,

          name,
          price,
          initialStock,

          deleted: false,
        },
      ],
    }));
    useLogStore
      .getState()
      .addLog("create", "item", { id, instanceId, name, initialStock, price });
    return id;
  },

  deletePurchase(id) {
    set((store) => {
      const i = store.purchases.findIndex((purchase) => purchase.id === id);
      return {
        purchases: [
          ...store.purchases.slice(0, i),
          {
            ...store.purchases[i],
            deleted: true,
          },
          ...store.purchases.slice(i + 1),
        ],
      };
    });
    useLogStore.getState().addLog("delete", "purchase", { id });
  },
  deleteItem(id) {
    set((store) => {
      const i = store.items.findIndex((item) => item.id === id);
      return {
        items: [
          ...store.items.slice(0, i),
          {
            ...store.items[i],
            deleted: true,
          },
          ...store.items.slice(i + 1),
        ],
      };
    });
    useLogStore.getState().addLog("delete", "item", { id });
  },

  updateItem(id, name, initialStock, price) {
    set((store) => {
      const i = store.items.findIndex((item) => item.id === id);
      return {
        items: [
          ...store.items.slice(0, i),
          {
            ...store.items[i],
            name,
            initialStock,
            price,
          },
          ...store.items.slice(i + 1),
        ],
      };
    });
    useLogStore
      .getState()
      .addLog("update", "item", { id, name, initialStock, price });
  },

  setHasSeenWelcome(hasSeen: boolean): void {
    set({
      hasSeenWelcome: hasSeen,
    });
  },

  deleteInstance(id: string): void {
    // Permanently delete the instance and all associated items and purchases
    set((store) => {
      const i = store.instances.findIndex((instance) => instance.id === id);
      if (i === -1) return store; // Instance not found, do nothing

      return {
        instances: [
          ...store.instances.slice(0, i),
          ...store.instances.slice(i + 1),
        ],
        items: store.items.filter((item) => item.instanceId !== id),
        purchases: store.purchases.filter(
          (purchase) => purchase.instanceId !== id
        ),
      };
    });
    useLogStore.getState().addLog("delete", "instance", { id });
  },
}));

export default usePOSStore;
