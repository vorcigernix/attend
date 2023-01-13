import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { validateSignature } from "$lib/indexedDBUtil";

export const newEventStore = writable();
export const userInfo = writable();
let userkeystore;

if (browser) {
    userkeystore = await validateSignature() //|| null;
    console.log(userkeystore);
}
