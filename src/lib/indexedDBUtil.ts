import Arweave from "arweave";
const DEVICE_IDB_IDENT = "RSVP_DEVICE_KEY_IDENT";
const KEYPAIR_IDENT = "RSVP_DEVICE_KEY_PAIR" as "RSVP_DEVICE_KEY_PAIR";
const arweave = Arweave.init({});

type IDBKeyPairObject = {
  id: typeof KEYPAIR_IDENT;
  keyPair: CryptoKeyPair;
};

async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    false,
    ["sign"],
  );
}

async function generateARJWT() {
  return await arweave.wallets.generate();
}

async function generateARKeyPair(jwt): Promise<any> {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwt,
    { //these are the algorithm options
      name: "RSA-PSS",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["sign"],
  );
}

async function getKeyPairDatabase(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open(DEVICE_IDB_IDENT, 1);
    openRequest.onerror = (ev) => {
      console.error("Error opening key database", ev);
      reject(openRequest.error);
    };
    openRequest.onsuccess = (ev) => {
      const db = openRequest.result;
      resolve(db);
    };
    openRequest.onupgradeneeded = (ev) => {
      openRequest.result.createObjectStore(DEVICE_IDB_IDENT, { keyPath: "id" });
    };
  });
}

async function getKeyPairFromDB(
  db: IDBDatabase,
): Promise<[CryptoKeyPair, boolean]> {
  return new Promise<[CryptoKeyPair, boolean]>((resolve, reject) => {
    const getTransaction = db.transaction(DEVICE_IDB_IDENT, "readonly");
    const objectStore = getTransaction.objectStore(DEVICE_IDB_IDENT);
    const getRequest = objectStore.get(KEYPAIR_IDENT);
    getRequest.onerror = (ev) => {
      console.error("Error getting key object", ev);
      reject(getRequest.error);
    };
    getRequest.onsuccess = async (ev) => {
      let obj: IDBKeyPairObject = getRequest.result;
      if (obj) {
        console.log("Found existing device key pair in IDB");
        resolve([obj.keyPair, true]);
      } else {
        reject(
          new Error(
            "Key does not exist",
          ),
        );
      }
    };
  });
}

async function storeKeyPair(
  db: IDBDatabase,
): Promise<[CryptoKeyPair, boolean, String]> {
  return new Promise<[CryptoKeyPair, boolean, String]>((resolve, reject) => {
    const getTransaction = db.transaction(DEVICE_IDB_IDENT, "readonly");
    const objectStore = getTransaction.objectStore(DEVICE_IDB_IDENT);
    const getRequest = objectStore.get(KEYPAIR_IDENT);
    getRequest.onerror = (ev) => {
      console.error("Error getting key object", ev);
      reject(getRequest.error);
    };
    getRequest.onsuccess = async () => {
      let obj: IDBKeyPairObject = getRequest.result;
      if (obj) {
        console.error("Found existing device key pair, not overwriting");
        resolve([obj.keyPair, true, "Validation token already exist"]);
      } else {
        const arjwt = await generateARJWT();
        const keyPair = await generateARKeyPair(arjwt);
        obj = {
          id: KEYPAIR_IDENT,
          keyPair,
        };
        const putTransaction = db.transaction(DEVICE_IDB_IDENT, "readwrite");
        const objectStore = putTransaction.objectStore(DEVICE_IDB_IDENT);
        const putRequest = objectStore.put(obj);
        putRequest.onerror = (ev) => {
          // ToDo: is indexeddb available e.g. in Firefox Private Windows?
          // Client would just fail connecting then.
          console.error("Error putting key object", ev);
          reject(putRequest.error);
        };
        putRequest.onsuccess = () => {
          console.log("New device key pair saved to IDB");
          resolve([keyPair, false, JSON.stringify(arjwt)]);
        };
      }
    };
  });
}

let keyPairPromise: Promise<[CryptoKeyPair, boolean]> | undefined;
export async function getDeviceKeyPair(): Promise<[CryptoKeyPair, boolean]> {
  if (!keyPairPromise) {
    keyPairPromise = new Promise<[CryptoKeyPair, boolean]>(
      async (resolve, reject) => {
        try {
          const db = await getKeyPairDatabase();
          resolve(await getKeyPairFromDB(db));
        } catch (e) {
          try {
            // indexeddb not available?
            const keyPair = await generateKeyPair();
            console.error(
              `Indexeddb for key pair storage not accessible. Ignore this error if this is a Firefox Private Tab.`,
            );
            resolve([keyPair, true]);
          } catch (e) {
            reject(
              new Error(
                "Error generating device keypair - this is probably a browser issue",
              ),
            );
          }
        }
      },
    );
  }

  return keyPairPromise;
}

export async function writeDeviceKeyPair() {
  if (!keyPairPromise) {
    return new Promise<[CryptoKeyPair, boolean, String]>(
      async (resolve, reject) => {
        try {
          const db = await getKeyPairDatabase();
          resolve(await storeKeyPair(db));
        } catch (e) {
          reject(
            new Error(
              "Error writing device keypair - this is probably a browser issue",
            ),
          );
        }
      },
    );
  } else return keyPairPromise;
}
