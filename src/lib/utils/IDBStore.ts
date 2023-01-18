import { IDBKeyObject } from "./interfaces";

export class IDBStore {
  private dbName: string;
  private dbVersion: number;
  private storeName: string;

  constructor(dbName: string, dbVersion: number, storeName: string) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
  }

  async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = (event) => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(request.error);
      };
    });
  }

  async get(key: any): Promise<IDBKeyObject | undefined> {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const request = db
        .transaction([this.storeName], "readonly")
        .objectStore(this.storeName)
        .get(key);
      request.onsuccess = (event) => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(request.error);
      };
    });
  }

  async set(value: IDBKeyObject): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const request = db
        .transaction([this.storeName], "readwrite")
        .objectStore(this.storeName)
        .put(value);
      request.onsuccess = (event) => {
        resolve();
      };
      request.onerror = (event) => {
        reject(request.error);
      };
    });
  }

  async remove(key: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const request = db
        .transaction([this.storeName], "readwrite")
        .objectStore(this.storeName)
        .delete(key);
      request.onsuccess = (event) => {
        resolve();
      };
      request.onerror = (event) => {
        reject(request.error);
      };
    });
  }
}
