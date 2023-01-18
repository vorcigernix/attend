import { User } from "./interfaces";

export class UserDetails {
  async sign(privateKey: CryptoKey, details: User): Promise<Uint8Array> {
    const signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-384",
      },
      privateKey,
      new TextEncoder().encode(JSON.stringify(details)),
    );
    return new Uint8Array(signature);
  }

  async verify(
    publicKey: CryptoKey,
    details: User,
    signature: Uint8Array,
  ): Promise<boolean> {
    return await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: "SHA-384",
      },
      publicKey,
      signature,
      new TextEncoder().encode(JSON.stringify(details)),
    );
  }

  async encode(details: User): Promise<User> {
    return {
      ...details,
      ...{ nickname: encodeURI(details.nickname) },
    };
  }

  async decode(details: User): Promise<User> {
    return {
      ...details,
      ...{ nickname: decodeURI(details.nickname) },
    };
  }
}
