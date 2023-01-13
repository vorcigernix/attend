import { exmInstance } from './exmInstance.js'
import { functionId } from './pkfunctionId.js'

const inputs = [{
  type: 'delete',
  accountId: process.argv[2]
}];

await exmInstance.functions.write(functionId, inputs)