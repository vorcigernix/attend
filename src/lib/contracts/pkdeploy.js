import { ContractType, Exm } from '@execution-machine/sdk'
import fs from 'fs'
import { state } from './pkstate.js'

const APIKEY = process.env.EXM_PK;
export const exmInstance = new Exm({ token: APIKEY });

const contractSource = fs.readFileSync('pkfunction.js')
const data = await exmInstance.functions.deploy(contractSource, state, ContractType.JS)

console.log({ data })

/* after the contract is deployed, write the function id to a local file */
fs.writeFileSync('./pkfunctionId.js', `export const functionId = "${data.id}"`)
