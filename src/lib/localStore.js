import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { getDeviceKeyPair } from "$lib/indexedDBUtil.ts";

let username;

if (browser) {
    username = JSON.parse(localStorage.getItem('username')) || "";
}

export const userNameStore = writable(username);
export const newEventStore = writable();
export const userKeyStore = writable();

if (browser) {
    userNameStore.subscribe((value) =>
        localStorage.setItem('username', JSON.stringify(value))
    );

    userKeyStore.update(async () => await getDeviceKeyPair());

}