export async function handle(state, action) {
  const { input } = action;
  if (input.type === 'createAccount' || input.type === 'updateAccount') {
    state.accounts[input.account.id] = input.account;
  }
  if (input.type === 'delete') {
    delete state.accounts[input.accountId];
  }
  if (input.type === 'fetchAccount') {
    return { result: Object.values(state.accounts).find((a) => a.nickname === input.accountName) };
  }
  return { state };
}