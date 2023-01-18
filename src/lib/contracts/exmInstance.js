import { Exm } from '@execution-machine/sdk';
const APIKEY = process.env.VITE_EXM_PK;
export const exmInstance = new Exm({ token: APIKEY });