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
    value: string,
  ) => CancelablePromise<void> | undefined;
  getItem: (
    keys: CloudStorageKeys[],
  ) => CancelablePromise<Record<CloudStorageKeys, string>> | undefined;
  getKeys: () => CancelablePromise<string[]> | undefined;
  deleteItem: (
    key: CloudStorageKeys | CloudStorageKeys[],
  ) => CancelablePromise<void> | undefined;
}

export const useCloudStorage = (): CloudStorage => {
  if (!isCloudStorageSupported()) {
    throw new Error("Cloud storage is not supported in this browser");
  }

  const setItem = (key: string, value: string) => {
    if (setCloudStorageItem.isSupported()) {
      return setCloudStorageItem(key, value);
    }
  };

  const getItem = (keys: string[]) => {
    if (getCloudStorageItem.isSupported()) {
      return getCloudStorageItem(keys);
    }
  };

  const getKeys = () => {
    if (getCloudStorageKeys.isSupported()) {
      return getCloudStorageKeys();
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
    deleteItem,
  };
};
