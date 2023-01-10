const DEVICE_IDB_IDENT = "ATTND_DEVICE_KEY_IDENT";
const KEYPAIR_IDENT = "ATTND_DEVICE_KEY_PAIR" as "ATTND_DEVICE_KEY_PAIR";

type IDBKeyPairObject = {
  id: typeof KEYPAIR_IDENT;
  keyPair: CryptoKeyPair;
  name: String;
  signature: ArrayBuffer;
};

export async function generateAndWriteKeys(name: string) {
  //console.log(name);
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
  );
  const signature = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-384",
    },
    keyPair.privateKey,
    new TextEncoder().encode(name),
  );
  try {
    writeKeyPair(await nonExportableKeyPairs, name, signature);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }

  return { priv: privateKey, pub: publicKey, nickname: name };
}

async function makeKeysNonExportable(jwkpriv, jwkpub) {
  let priv: CryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    jwkpriv,
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    false,
    ["sign"],
  );
  let pub: CryptoKey = await window.crypto.subtle.importKey(
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

async function writeKeyPair(
  keyPair: CryptoKeyPair,
  name: String,
  signature: ArrayBuffer,
) {
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
        name,
        signature,
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

async function getDbKeyAndSignature(
  db: IDBDatabase,
): Promise<[CryptoKey, ArrayBuffer, String]> {
  return new Promise<[CryptoKey, ArrayBuffer, String]>((resolve, reject) => {
    const getTransaction = db.transaction(DEVICE_IDB_IDENT, "readonly");
    const objectStore = getTransaction.objectStore(DEVICE_IDB_IDENT);
    const getRequest = objectStore.get(KEYPAIR_IDENT);
    getRequest.onerror = (ev) => {
      console.error("Error getting key object", ev);
      reject(getRequest.error);
    };
    getRequest.onsuccess = async () => {
      //console.log(getRequest.result);
      let obj: IDBKeyPairObject = getRequest.result;
      if (obj) {
        resolve([obj.keyPair.publicKey, obj.signature, obj.name]);
      } else {
        console.error("Object misformatted", getRequest.error);
        reject(getRequest.error);
      }
    };
  });
}

export async function getKeyAndSignature(): Promise<
  [CryptoKey, ArrayBuffer, String]
> {
  return new Promise<[CryptoKey, ArrayBuffer, String]>(
    async (resolve, reject) => {
      try {
        const db = await getKeyPairDatabase();
        resolve(await getDbKeyAndSignature(db));
      } catch (e) {
        reject(console.info("validation not set"));
      }
    },
  );
}
