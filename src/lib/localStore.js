import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { validateSignature } from "$lib/indexedDBUtil";

export const newEventStore = writable();
export const userInfo = writable();
let userInfoDetails;

if (browser) {
    userInfoDetails = await validateSignature(); //|| null;
    if (userInfoDetails.valid)
        userInfo.set(userInfoDetails);
}
