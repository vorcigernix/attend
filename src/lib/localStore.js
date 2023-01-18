import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { validateSignature } from "$lib/utils/indexedDBUtil";

export const newEventStore = writable();
export const userInfo = writable();
let userInfoDetails;

if (browser) {
    userInfoDetails = await validateSignature(); //|| null;
    //console.log(userInfoDetails);
    if (userInfoDetails.valid)
        userInfo.set(userInfoDetails);
}
