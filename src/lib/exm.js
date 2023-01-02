import { Exm } from '@execution-machine/sdk';

const APIKEY = import.meta.env.VITE_EXM_PK || process.env.VITE_EXM_PK;
export const exmInstance = new Exm({ token: APIKEY });