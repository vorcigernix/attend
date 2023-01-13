import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const keyandsignature = await request.json();
    console.log(keyandsignature);
    let result = await crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: "SHA-384" },
        },
        key,
        signature,
        new TextEncoder().encode(userdetails.nickname)
    );
    return result;
}