import { error, json } from "@sveltejs/kit";
import { exmInstance } from "$lib/exm";
import { functionId } from "$lib/contracts/pkfunctionId.js";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { userdetails } = await request.json();
  //console.log(JSON.parse(userdetails).uid);
  const searchInputs = [{
    type: "fetchPubKey",
    accountId: JSON.parse(userdetails).uid,
  }];
  const searchfn = await exmInstance.functions.write(
    functionId,
    searchInputs,
    true,
    false,
  );
  const key = await searchfn.data.execution.result;
  //console.log(await existingUser);
  return json(key);
}
