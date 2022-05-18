//support.js
import * as crypto from 'node:crypto';
import * as hasher from 'multiformats/hashes/hasher';
import * as IPFS from "ipfs-core";
import { CID } from 'multiformats/cid';

let tEnc = new TextEncoder();

let gencharmap = function() {
  const cMap = new Map();
  for (let i = 0; i < 26; i++) { //Letters
    cMap.set((i.toString(2)).padStart(6,"0"),String.fromCharCode(97+i));
    cMap.set(String.fromCharCode(97+i),(i.toString(2)).padStart(6,"0"));
  }

  for (let i = 0; i < 10; i++) { //Numbers
    cMap.set(((26+i).toString(2)).padStart(6,"0"),String.fromCharCode(48+i));
    cMap.set(String.fromCharCode(48+i),((26+i).toString(2)).padStart(6,"0"));
  }

  //symbols & other characters.
  cMap.set((36).toString(2),String.fromCharCode(33)); cMap.set(String.fromCharCode(33),(36).toString(2)); // !
  cMap.set((38).toString(2),String.fromCharCode(45)); cMap.set(String.fromCharCode(45),(38).toString(2)); // -
  cMap.set((37).toString(2),String.fromCharCode(39)); cMap.set(String.fromCharCode(39),(37).toString(2)); // ''
  cMap.set((40).toString(2),String.fromCharCode(58)); cMap.set(String.fromCharCode(58),(40).toString(2)); // :
  cMap.set((39).toString(2),String.fromCharCode(46)); cMap.set(String.fromCharCode(46),(39).toString(2)); // .
  cMap.set((41).toString(2),String.fromCharCode(47)); cMap.set(String.fromCharCode(47),(41).toString(2)); // /
  cMap.set((42).toString(2),String.fromCharCode(63)); cMap.set(String.fromCharCode(63),(42).toString(2)); // ?
  cMap.set((44).toString(2),String.fromCharCode(32)); cMap.set(String.fromCharCode(32),(44).toString(2));//space
  cMap.set((43).toString(2),String.fromCharCode(124)); cMap.set(String.fromCharCode(124),(43).toString(2)); // | Term Char

  return cMap;
}

const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

let gencid = function(words) {
  let buf = new TextEncoder().encode(words);
  const hash = sha256.digest(buf);
  return CID.create(0, 0x70, hash); //version, codec, hash...
}

let guessblock = async function(cid,to) {
  let guessCID; let result = false;
  try {
    const decoder = new TextDecoder()
    guessCID = await ipfs.block.get(cid,{timeout:1000});
    console.log(decoder.decode(guessCID));
    result = true;
  } catch (e) { console.log("No block found");  } //Don't care about timeout errors. Just return false.
  return result;
}

export { gencharmap, guessblock, sha256, gencid, tEnc };
