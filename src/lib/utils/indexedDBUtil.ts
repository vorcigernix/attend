import {
  DEVICE_IDB_IDENT,
  IDBKeyPairObject,
  KEYPAIR_IDENT,
  userdetails,
} from "./types";

export async function restoreKeys(
  pvk: string,
  userdetails: userdetails,
  sig: Uint8Array,
) {
  // let sigobj = (JSON.parse(sig));
  // sigobj = Object.values(sigobj);
  //console.log(sigobj);
  console.log(pvk, userdetails, sig);
  const encuserobj: userdetails = {
    ...userdetails,
    ...{ nickname: encodeURI(userdetails.nickname) },
  };
  let priv: CryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    pvk as JsonWebKey,
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    false,
    ["sign"],
  );
  // userSignature = await window.crypto.subtle.sign(
  //   {
  //     name: "ECDSA",
  //     hash: "SHA-384",
  //   },
  //   keyPair.privateKey,
  //   new TextEncoder().encode(JSON.stringify(userdetails)),
  // );
  // const signArray = new Uint8Array(userSignature);
  try {
    await writeKey(
      priv,
      userdetails,
      sig,
    );
  } catch {
    throw new Error("Failed to recover account");
  }
}

export async function generateAndWriteKeys(name: string) {
  const uid = crypto.randomUUID();
  const userdetails = { nickname: encodeURI(name), uid: uid };
  let userSignature: ArrayBuffer;
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
  userSignature = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-384",
    },
    keyPair.privateKey,
    new TextEncoder().encode(JSON.stringify(userdetails)),
  );
  const uint8Signature = new Uint8Array(userSignature);
  try {
    const neKP = await nonExportableKeyPairs;
    const regresult: boolean = await registerKeyPair(publicKey, userdetails);
    // const regresult = true;
    if (regresult) {
      await writeKey(
        neKP.privateKey,
        userdetails,
        uint8Signature,
      );
    } else {
      throw new Error("Account exists");
    }
  } catch (e) {
    //console.log(e);
    throw new Error(e);
  }
  return {
    privateKey,
    userdetails,
    uint8Signature,
  };
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

async function writeKey(
  key: CryptoKey,
  name: userdetails,
  signature: Uint8Array,
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
          key,
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
): Promise<IDBKeyPairObject> {
  return new Promise<IDBKeyPairObject>((resolve, reject) => {
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
        resolve(obj);
      } else {
        console.info("No ID found ", getRequest.error);
        reject();
      }
    };
  });
}

export async function validateSignature() {
  try {
    const db = await getKeyPairDatabase();
    const ixDbData = await getIxDbNameAndSignature(db);
    //console.log(ixDbData.name.uid);
    //return { valid: false, userdetails: null };
    const exmDbPbKey = await fetchPublicKey(ixDbData.name);
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
    const encoded = new TextEncoder().encode(JSON.stringify(ixDbData.name));
    const valid = await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-384" },
      },
      pub,
      ixDbData.signature,
      encoded,
    );
    //console.log(valid);
    return { valid: valid, userdetails: ixDbData.name };
  } catch {
    return { valid: false, userdetails: null };
  }
}
