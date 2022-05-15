const IPFS = require('ipfs-core')

const ipfs = await IPFS.create()
const id = await ipfs.id()
console.log(ipfs)
console.log(id)
