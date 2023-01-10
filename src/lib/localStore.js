import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { getKeyAndSignature } from "$lib/indexedDBUtil";

export const newEventStore = writable();
export const userInfo = writable();
let userkeystore;

if (browser) {
    userkeystore = await getKeyAndSignature() || null;
    console.log(userkeystore);
    //console.log(await check(userKeyStore.keyPair.publicKey, userKeyStore.name, userKeyStore.signature));


}

async function check(publicKey, data, signature) {
    const response = await fetch('/checkSignature', {
        method: 'POST',
        body: JSON.stringify({ a, b }),
        headers: {
            'content-type': 'application/json'
        }
    });

    return await response.json();
}