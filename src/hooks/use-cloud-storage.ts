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
  ) => Promise<void> | undefined;
  addItem: (
    key: CloudStorageKeys,
    value: string | object | object[],
  ) => Promise<void> | undefined;
  getItem: (
    keys: CloudStorageKeys[],
  ) => Promise<
    Record<CloudStorageKeys, string | object | object[]> | undefined
  >;
  getKeys: () => Promise<CloudStorageKeys[]> | undefined;
  deleteItem: (
    key: CloudStorageKeys | CloudStorageKeys[],
  ) => Promise<void> | undefined;
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

  const addItem = async (
    key: CloudStorageKeys,
    value: string | object | object[],
  ) => {
    if (
      setCloudStorageItem.isSupported() &&
      getCloudStorageItem.isSupported()
    ) {
      try {
        // Retrieve the current value
        const currentData = await getCloudStorageItem([key]);

        let updatedValue;

        if (currentData && currentData[key]) {
          try {
            const parsedData = JSON.parse(currentData[key]);

            if (Array.isArray(parsedData)) {
              // Append the new value directly if it's an object, or spread if it's an array
              if (Array.isArray(value)) {
                updatedValue = [...parsedData, ...value];
              } else {
                updatedValue = [...parsedData, value];
              }
            } else if (typeof parsedData === "object") {
              // Merge with existing object
              if (typeof value === "object" && !Array.isArray(value)) {
                updatedValue = { ...parsedData, ...value };
              } else {
                throw new Error("Cannot merge non-object value with an object");
              }
            } else {
              // Overwrite non-object, non-array values
              updatedValue = value;
            }
          } catch {
            // If parsing fails, treat as a string and overwrite
            updatedValue = value;
          }
        } else {
          // If no existing data, set the value directly
          updatedValue = value;
        }

        // Serialize and store the updated value
        const serializedValue =
          typeof updatedValue === "string"
            ? updatedValue
            : JSON.stringify(updatedValue);

        return setCloudStorageItem(key, serializedValue);
      } catch (error) {
        console.error("Failed to set item in cloud storage:", error);
      }
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

  const deleteItem = (key: string | string[]) => {
    if (deleteCloudStorageItem.isSupported()) {
      return deleteCloudStorageItem(key);
    }
  };

  return {
    setItem,
    addItem,
    getItem,
    getKeys,
    deleteItem,
  };
};
