/** @type {import('./$types').PageLoad} */
import { functionId } from '$lib/contracts/functionId.js';
export async function load({ fetch }) {
    const res = await fetch(`https://api.exm.dev/read/${functionId}`);
    const { posts } = await res.json();

    return { posts };
}