import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { publicKey, data, signature } = await request.json();
    let result = await crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: "SHA-384" },
        },
        publicKey,
        signature,
        new TextEncoder().encode(data)
    );
    return result;
}