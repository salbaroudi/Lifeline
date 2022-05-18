import * as IPFS from "ipfs-core";
import { CID } from 'multiformats/cid';
import * as hasher from 'multiformats/hashes/hasher';
import * as crypto from 'node:crypto';

const ipfs = await IPFS.create();

//why do we need dag-cbor??? Why not just default block encoding? Who cares?

//Test Seed phrase and block.put() a node up.
let seedPhrase = "canarymoleseagullwallabieetcetc...";
let pCounter = 0;

const tEnc = new TextEncoder;
const buf = tEnc.encode(seedPhrase)
const decoder = new TextDecoder()

let block = await ipfs.block.put(buf);
console.log("put block cid=" + block);


const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

let hash = await sha256.digest(buf);
//console.log("json.encode:" + json.encode(obj))
let cid = CID.create(0, 0x70, hash) //version, codec, hash...
console.log("Our generated CID is: " + cid);

//We can! so lets try to get() the CID we generated. What do we end up with?
//api says you can slam valid strings into .get()...but you cant! always parse it to a CID object.
let fetch = await ipfs.block.get(CID.parse("QmWX3Y24EKiTFPEX4AtBwQ4i1BgJQKruMmo8ZgMrmj6Y7s")); //cid
console.log("Getting our valid CID: ");
console.log(fetch); //Buffer that needs converted to string.

//Lets add 5 blocks, and then read the back. Can we do it?
//Put
let cidArr = [];
for (let i = 0; i < 5; i++) {
  let str = (seedPhrase + (i).toString(2));
  block = await ipfs.block.put(tEnc.encode(str));
  cidArr.push(block);
}
console.log(cidArr);

//Get
for (let i = 0; i < 5; i++) {
  let str = (seedPhrase + (i).toString(2));
  hash = await sha256.digest(tEnc.encode(str));
  cid = CID.create(0, 0x70, hash) //version, codec, hash...
  fetch = await ipfs.block.get(cid); //cid
  console.log(decoder.decode(fetch));
}
