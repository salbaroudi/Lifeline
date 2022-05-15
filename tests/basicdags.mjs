'use strict';

//Load IPFS core module with ES import.
import * as IPFS from "ipfs-core";
import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json'
//import { sha256 } from 'multiformats/hashes/sha2';
import * as hasher from 'multiformats/hashes/hasher';
import * as crypto from 'node:crypto';

const ipfs = await IPFS.create();

//Test Seed phrase
let seedPhrase = "canarymoleseagullwallabieetcetc...";
let pCounter = 0;

//Put our initialization node on the local node
// CID Produced: bafyreiam2jt72nf52lq3dhqqpkfle3jclknjc3eutzprdpnvbo4zejfkxm
// cidv1 address with the following settings:
//"b" prefix => base32
// Multicodec => dag-cbor
// Multihash => sha2-256

//As far as I can tell, all hashing is correct

//From help page:
const obj = json.encode({ hello: 'world' });
//console.log("json.encode:" + json.encode(obj))
//console.log(obj);

const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

const hash = await sha256.digest(obj);
//console.log("json.encode:" + json.encode(obj))
const cid = CID.create(1, 0x71, hash) //version, codec, hash...
console.log("Our generated CID is: " + cid.toString());


const cid2 = await ipfs.dag.put(obj);
console.log("Our dag.put CID is=" + cid2.toString());

//Now check to see if this node exists:
//const result = await ipfs.dag.get(cid2)
//console.log(result.value)
