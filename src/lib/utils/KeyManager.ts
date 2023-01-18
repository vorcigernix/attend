import { IDBKeyObject, User } from "./interfaces";

export class KeyManager {
  storePublicKey(publicKey: CryptoKey, userDetails: User) {
    return true;
  }
  getPublicKeyByUser(userDetails: User) {
    return false;
  }
  async generateKeyPair(): Promise<
    { privateKey: CryptoKey; publicKey: CryptoKey }
  > {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-384",
      },
      true,
      ["sign", "verify"],
    );
    return { privateKey: keyPair.privateKey, publicKey: keyPair.publicKey };
  }

  async importKey(key: JsonWebKey, isPrivate: boolean): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      "jwk",
      key,
      {
        name: "ECDSA",
        namedCurve: "P-384",
      },
      false,
      isPrivate ? ["sign"] : ["verify"],
    );
  }
}
