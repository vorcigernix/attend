//Interfaces
interface User {
  nickname: string;
  uid: string;
}

interface IDBKeyObject {
  id: string;
  key: CryptoKey;
  name: User;
  signature: Uint8Array;
}

export { IDBKeyObject, User };
