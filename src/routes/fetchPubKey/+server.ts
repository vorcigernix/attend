import { error, json } from "@sveltejs/kit";
import { exmInstance } from "$lib/exm";
import { functionId } from "$lib/contracts/pkfunctionId.js";
import { userdetails } from "$lib/utils/types";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { userdetails } = await request.json();
  //console.log(userdetails);
  const searchInputs = [{
    type: "fetchPubKey",
    accountId: userdetails.uid,
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
