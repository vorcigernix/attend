import { exmInstance } from './exmInstance.js'
import { functionId } from './functionId.js'

const inputs = [{
  type: 'deletePost',
  postId: process.argv[2]
}];

await exmInstance.functions.write(functionId, inputs)