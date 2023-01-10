import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { getKeyAndSignature } from "$lib/indexedDBUtil";

export const newEventStore = writable();
export const userInfo = writable();
let userkeystore;

if (browser) {
    userkeystore = await getKeyAndSignature() || null;
    console.log(userkeystore);
    //OMG, sorry if you read this
    console.log(await checkLocally(userkeystore[0], userkeystore[1], userkeystore[2]));


}

async function check(publicKey, data, signature) {
    const response = await fetch('/checkSignature', {
        method: 'POST',
        body: JSON.stringify({ data, signature }),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${publicKey}`
        }
    });

    return await response.json();
}

async function checkLocally(publicKey, data, signature) {
    //console.log(publicKey);
    const encoded = new TextEncoder().encode(data);
    return await window.crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: "SHA-384" },
        },
        publicKey,
        signature,
        encoded
    );
}