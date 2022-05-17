import * as IPFS from "ipfs-core";
import { CID } from 'multiformats/cid';
import * as hasher from 'multiformats/hashes/hasher';
import * as crypto from 'node:crypto';

const ipfs = await IPFS.create();

//Test Seed phrase
let seedPhrase = "canarymoleseagullwallabieetcetc...";
let pCounter = 0;


const buf = new TextEncoder().encode(seedPhrase)
console.log("buf=" + buf);
const decoder = new TextDecoder()

const block = await ipfs.block.put(buf,{format:"dag-cbor",mhtype:"sha2-256", version:1});
console.log("put block cid=" + block);


//And can we generate normally?
const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

const hash = await sha256.digest(buf);
//console.log("json.encode:" + json.encode(obj))
const cid = CID.create(1, 0x71, hash) //version, codec, hash...
console.log("Our generated CID is: " + cid.toString());

//We can! so lets try to get() the CID we generated. What do we end up with?
const fetch = await ipfs.block.get(cid)
console.log("Getting our valid CID: " + fetch);

//versus, a bullshit CID.
//We cant just change random letters in a known CID (invalid error)
//..let's generate a new one without adding.
const buf2 = new TextEncoder().encode("hellohellohello");
const hash2 = await sha256.digest(buf2);
//console.log("json.encode:" + json.encode(obj))
const cid2 = CID.create(1, 0x71, hash2) //version, codec, hash...
const fetchBS = await ipfs.block.get(cid2,{timeout:1000});
console.log("Getting our generated (non-put) CID: " + fetchBS);

//We have to process a timeout error to reasonably "know" that there is no existing CID.
//This is quite difficult.
