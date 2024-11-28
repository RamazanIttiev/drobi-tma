import {
  CancelablePromise,
  deleteCloudStorageItem,
  getCloudStorageItem,
  getCloudStorageKeys,
  isCloudStorageSupported,
  setCloudStorageItem,
} from "@telegram-apps/sdk-react";
import { CloudStorageKeys } from "@/common/models.ts";

interface CloudStorage {
  setItem: (
    key: CloudStorageKeys,
    value: string | object | object[],
  ) => CancelablePromise<void> | undefined;
  getItem: (
    keys: CloudStorageKeys[],
  ) => Promise<
    Record<CloudStorageKeys, string | object | object[]> | undefined
  >;
  getKeys: () => CancelablePromise<CloudStorageKeys[]> | undefined;
  editItem: (
    key: CloudStorageKeys,
    modifyFn: (value: string | object | object[]) => string | object | object[],
  ) => Promise<void>;
  deleteItem: (
    key: CloudStorageKeys | CloudStorageKeys[],
  ) => CancelablePromise<void> | undefined;
}

export const useCloudStorage = (): CloudStorage => {
  if (!isCloudStorageSupported()) {
    throw new Error("Cloud storage is not supported in this browser");
  }

  const setItem = (
    key: CloudStorageKeys,
    value: string | object | object[],
  ) => {
    if (setCloudStorageItem.isSupported()) {
      const serializedValue =
        typeof value === "string" ? value : JSON.stringify(value);

      return setCloudStorageItem(key, serializedValue);
    }
  };

  const getItem = async (
    keys: CloudStorageKeys[],
  ): Promise<
    Record<CloudStorageKeys, string | object | object[]> | undefined
  > => {
    if (getCloudStorageItem.isSupported()) {
      const rawData = await getCloudStorageItem(keys);

      if (rawData) {
        const parsedData: Record<CloudStorageKeys, string | object | object[]> =
          {};

        Object.entries(rawData).forEach(([key, value]) => {
          try {
            // Attempt to parse the value as JSON
            parsedData[key as CloudStorageKeys] = JSON.parse(value);
          } catch {
            // If parsing fails, treat it as a plain string
            parsedData[key as CloudStorageKeys] = value;
          }
        });

        return parsedData;
      }
    }
  };

  const getKeys = () => {
    if (getCloudStorageKeys.isSupported()) {
      return getCloudStorageKeys() as CancelablePromise<CloudStorageKeys[]>;
    }
  };

  const editItem = async (
    key: CloudStorageKeys,
    modifyFn: (value: object | string) => object | string,
  ) => {
    if (
      getCloudStorageItem.isSupported() &&
      setCloudStorageItem.isSupported()
    ) {
      try {
        // Retrieve the existing item
        const existingData = await getItem([key]);
        const value = existingData?.[key];
        console.log(existingData, value);
        // Check if the item exists
        if (existingData && value) {
          let currentValue: string | object | object[];

          if (typeof value !== "string") {
            currentValue = value;
          } else {
            currentValue = JSON.parse(value);
          }

          // Modify the value using the provided function
          const updatedValue = modifyFn(currentValue);

          // Save the updated value back to the cloud storage
          return setItem(key, JSON.stringify(updatedValue)); // Always store as JSON
        } else {
          throw new Error(`Key "${key}" does not exist in cloud storage`);
        }
      } catch (error) {
        console.error("Error editing cloud storage item:", error);
        throw error;
      }
    }
  };

  const deleteItem = (key: string | string[]) => {
    if (deleteCloudStorageItem.isSupported()) {
      return deleteCloudStorageItem(key);
    }
  };

  return {
    setItem,
    getItem,
    getKeys,
    editItem,
    deleteItem,
  };
};
