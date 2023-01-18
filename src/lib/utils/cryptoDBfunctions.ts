import { KeyManager } from "./KeyManager";
import { UserDetails } from "./UserDetails";
import { IDBStore } from "./IDBStore";
import { IDBKeyObject, User } from "./interfaces";

const keyManager = new KeyManager();
const userDetails = new UserDetails();
const store = new IDBStore("attnd_db", 1, "attnd_store");
const KEYPAIR_IDENT = "ATTND_DEVICE_KEY_PAIR" as "ATTND_DEVICE_KEY_PAIR";

export async function generateAndWriteKeys(name: string) {
  const { privateKey, publicKey } = await keyManager.generateKeyPair();
  const uid = crypto.randomUUID();
  const rawUserDetails = { nickname: name, uid: uid };
  const encodedDetails = await userDetails.encode(rawUserDetails);
  const signature = await userDetails.sign(privateKey, rawUserDetails);
  try {
    const regresult = await registerKeyPair(publicKey, encodedDetails);
    if (regresult) {
      const keyObject: IDBKeyObject = {
        id: KEYPAIR_IDENT,
        key: privateKey,
        name: encodedDetails,
        signature: signature,
      };
      await store.set(keyObject);
    } else {
      throw new Error("Account already exists");
    }
  } catch (e) {
    throw new Error(e);
  }
  return {
    pvk: privateKey,
    pubk: publicKey,
    userdetails: encodedDetails,
    sig: signature,
  };
}

export async function restoreKeys(
  pvk: string,
  pubk: string,
  details: User,
  signature: Uint8Array,
): Promise<void> {
  const privateKey = await keyManager.importKey(JSON.parse(pvk), true);
  const publicKey = await keyManager.importKey(JSON.parse(pubk), false);

  const encodedDetails = await userDetails.encode(details);
  const isVerified = await userDetails.verify(
    publicKey,
    encodedDetails,
    signature,
  );

  if (!isVerified) throw new Error("Failed to verify account details");
  try {
    const keyObject: IDBKeyObject = {
      id: KEYPAIR_IDENT,
      key: privateKey,
      name: encodedDetails,
      signature: signature,
    };
    await store.set(keyObject);
  } catch (e) {
    throw new Error(e);
  }
}

async function registerKeyPair(
  publicKey: CryptoKey,
  userDetails: User,
): Promise<boolean> {
  const existingKey = await keyManager.getPublicKeyByUser(userDetails);
  if (existingKey) {
    return false;
  }
  await keyManager.storePublicKey(publicKey, userDetails);
  return true;
}
