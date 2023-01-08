const DEVICE_IDB_IDENT = "ATTND_DEVICE_KEY_IDENT";
const KEYPAIR_IDENT = "ATTND_DEVICE_KEY_PAIR" as "ATTND_DEVICE_KEY_PAIR";

type IDBKeyPairObject = {
  id: typeof KEYPAIR_IDENT;
  keyPair: CryptoKeyPair;
};

export async function generateAndWriteKeys(name: String) {
  let keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    true,
    ["sign", "verify"],
  );
  const privateKey = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.privateKey,
  );
  const publicKey = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey,
  );
  const nonExportableKeyPairs = makeKeysNonExportable(
    privateKey,
    publicKey,
    name,
  );
  try {
    writeKeyPair(await nonExportableKeyPairs);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }

  return { priv: privateKey, pub: publicKey };
}

async function makeKeysNonExportable(jwkpriv, jwkpub, nickname) {
  jwkpriv = { nickname: nickname, ...jwkpriv };
  jwkpub = { nickname: nickname, ...jwkpub };
  const priv: CryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    jwkpriv,
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    false,
    ["sign"],
  );
  const pub: CryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    jwkpub,
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    false,
    ["verify"],
  );

  return { privateKey: priv, publicKey: pub };
}

async function writeKeyPair(keyPair: CryptoKeyPair) {
  const db = await getKeyPairDatabase();
  const getTransaction = db.transaction(DEVICE_IDB_IDENT, "readonly");
  const objectStore = getTransaction.objectStore(DEVICE_IDB_IDENT);
  const getRequest = objectStore.get(KEYPAIR_IDENT);
  getRequest.onerror = (ev) => {
    console.error("Error getting key object", ev);
    throw (getRequest.error);
  };

  getRequest.onsuccess = async (ev) => {
    let obj: IDBKeyPairObject = getRequest.result;
    if (obj) {
      console.log("Found existing device key pair in IDB");
      return [obj.keyPair, true];
    } else {
      obj = {
        id: KEYPAIR_IDENT,
        keyPair,
      };
      const putTransaction = db.transaction(DEVICE_IDB_IDENT, "readwrite");
      const objectStore = putTransaction.objectStore(DEVICE_IDB_IDENT);
      const putRequest = objectStore.put(obj);
      putRequest.onerror = (ev) => {
        // ToDo: is indexeddb available e.g. in Firefox Private Windows?
        // CLient would just fail connecting then.
        console.error("Error putting key object", ev);
        throw (putRequest.error);
      };
      putRequest.onsuccess = (ev) => {
        console.log("New device key pair saved to IDB");
        return [keyPair, false];
      };
    }
  };
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
    getRequest.onsuccess = async () => {
      let obj: IDBKeyPairObject = getRequest.result;
      if (obj) {
        resolve([obj.keyPair, true]);
      } else {
        console.error(getRequest.error);
        reject(getRequest.error);
      }
    };
  });
}

export async function getDeviceKeyPair(
  create: boolean,
): Promise<[CryptoKeyPair, boolean]> {
  let keyPairPromise = new Promise<[CryptoKeyPair, boolean]>(
    async (resolve, reject) => {
      try {
        const db = await getKeyPairDatabase();
        resolve(await getKeyPairFromDB(db));
      } catch (e) {
        reject(
          new Error(
            "Error generating device keypair - this is probably a browser issue",
          ),
        );
      }
    },
  );
  return keyPairPromise;
}
