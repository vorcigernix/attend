const DEVICE_IDB_IDENT = "ATTND_DEVICE_KEY_IDENT";
const KEYPAIR_IDENT = "ATTND_DEVICE_KEY_PAIR" as "ATTND_DEVICE_KEY_PAIR";

type IDBKeyPairObject = {
  id: typeof KEYPAIR_IDENT;
  keyPair: CryptoKeyPair;
  name: String;
  signature: ArrayBuffer;
};

export async function generateAndWriteKeys(name: string) {
  const uid = crypto.randomUUID();
  const userdetails = { nickname: name, uid: uid };
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
    new TextEncoder().encode(JSON.stringify(userdetails)),
  );
  try {
    const neKP = await nonExportableKeyPairs;

    const regresult: boolean = await registerKeyPair(publicKey, userdetails);
    if (regresult) {
      await writeKeyPair(
        neKP,
        JSON.stringify(userdetails),
        signature,
      );
    } else {
      throw new Error("Account exists");
    }
  } catch (e) {
    //console.log(e);
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
  return new Promise<boolean>(async (resolve, reject) => {
    const db = await getKeyPairDatabase();
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
        resolve(false);
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
          reject(putRequest.error);
        };
        putRequest.onsuccess = (ev) => {
          console.log("New device key pair saved to IDB");
          resolve(true);
        };
      }
    };
  });
}

async function registerKeyPair(
  key: JsonWebKey,
  userdetails: Object,
): Promise<boolean> {
  const response = await fetch("/createSignature", {
    method: "POST",
    body: JSON.stringify({ key, userdetails }),
    headers: {
      "content-type": "application/json",
    },
  });
  return response.status === 409 ? false : true;
}

async function fetchPublicKey(
  userdetails: Object,
): Promise<Object> {
  const response = await fetch("/fetchPubKey", {
    method: "POST",
    body: JSON.stringify({ userdetails }),
    headers: {
      "content-type": "application/json",
    },
  });
  const respObj: any = await response.json();
  return respObj["key"] as CryptoKey;
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

async function getIxDbNameAndSignature(
  db: IDBDatabase,
): Promise<[CryptoKey, ArrayBuffer, string]> {
  return new Promise<[CryptoKey, ArrayBuffer, string]>((resolve, reject) => {
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
        resolve([obj.keyPair.publicKey, obj.signature, `${obj.name}`]);
      } else {
        console.error("Object misformatted", getRequest.error);
        reject(getRequest.error);
      }
    };
  });
}

export async function validateSignature() {
  const db = await getKeyPairDatabase();
  const ixDbData = await getIxDbNameAndSignature(db);
  const exmDbPbKey = await fetchPublicKey(ixDbData[2]);
  let pub: CryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    exmDbPbKey,
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    false,
    ["verify"],
  );
  const encoded = new TextEncoder().encode(ixDbData[2]);
  const valid = await crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-384" },
    },
    //ixDbData[0],
    pub,
    ixDbData[1],
    encoded,
  );
  return { valid: valid, userdetails: ixDbData[2] };
}
