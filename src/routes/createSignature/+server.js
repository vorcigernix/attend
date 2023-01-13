import { error, json } from '@sveltejs/kit';
import { exmInstance } from '$lib/exm';
import { functionId } from '$lib/contracts/pkfunctionId.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, response }) {
    const { key, userdetails } = await request.json();
    //console.log(userdetails);
    const searchInputs = [{
        type: 'fetchAccount',
        accountName: userdetails.nickname
    }];
    const searchfn = await exmInstance.functions.write(functionId, searchInputs, true, false);
    const existingUser = await searchfn.data.execution.result;
    //console.log(existingUser);
    if (existingUser) throw error(409, "User already exist.");
    const addInputs = [{
        type: 'createAccount',
        account: { id: userdetails.uid, nickname: userdetails.nickname, key: key }
    }];
    const addfn = await exmInstance.functions.write(functionId, addInputs);
    return json(addfn);
}