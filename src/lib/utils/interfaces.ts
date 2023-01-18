//Constants
const DEVICE_IDB_IDENT = "ATTND_DEVICE_KEY_IDENT";
const KEYPAIR_IDENT = "ATTND_DEVICE_KEY_PAIR" as "ATTND_DEVICE_KEY_PAIR";

//Interfaces
interface User {
  nickname: string;
  uid: string;
}

interface IDBKeyObject {
  id: typeof KEYPAIR_IDENT;
  key: CryptoKey;
  name: User;
  signature: Uint8Array;
}

export { IDBKeyObject, User, KEYPAIR_IDENT};
