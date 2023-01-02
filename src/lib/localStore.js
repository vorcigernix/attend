import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let username;

if (browser) {
    username = JSON.parse(localStorage.getItem('username'))||"";
}

export const userNameStore = writable(username);
export const newEventStore = writable();

if (browser) {
    userNameStore.subscribe((value) =>
        localStorage.setItem('username', JSON.stringify(value))
    );
}