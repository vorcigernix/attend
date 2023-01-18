export const DEVICE_IDB_IDENT = "ATTND_DEVICE_KEY_IDENT";
export const KEYPAIR_IDENT = "ATTND_DEVICE_KEY_PAIR" as "ATTND_DEVICE_KEY_PAIR";
export type IDBKeyPairObject = {
  id: typeof KEYPAIR_IDENT;
  key: CryptoKey;
  name: userdetails;
  signature: ArrayBuffer;
};
export type userdetails = { nickname: string; uid: string; };
