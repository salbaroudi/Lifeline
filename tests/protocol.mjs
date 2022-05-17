import * as IPFS from "ipfs-core";
import { gencharmap, guessblock } from "./support.mjs";
import * as hasher from 'multiformats/hashes/hasher';
import { CID } from 'multiformats/cid';
import * as crypto from 'node:crypto';



const ipfs = await IPFS.create();
const cMap = gencharmap();
const timeoutms = 100;
let offsetIndex = 0; let offsetStr;

const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

let gencid = function(words) {
  let buf = new TextEncoder().encode(words);
  const hash = sha256.digest(buf);
  return CID.create(1, 0x71, hash); //version, codec, hash...
}

let phrase2buf = function(phrase) {
  return new TextEncoder().encode(phrase);
}

//Our Test Phrase:
const seedPhrase = "oxencatfishmouseseagullpenironpotbookpooldammallgazeboaloofformalcandidcaustic";

//Need to check if seed node exists. A thrown timeout error means we likely have no node.
let cidSP = gencid(seedPhrase);
let initiate = false;
let fetchState; let cidArr;
try {
  fetchState = await ipfs.block.get(cidSP,{timeout:timeoutms});
  (fetchState != null)? initiate=true:null;
} catch (e) {} //no need to recover.

if (!initiate) {
  fetchSP = await ipfs.block.put(phrase2buf(seedPhrase),{format:"dag-cbor",mhtype:"sha2-256", version:1});
  console.log("No seed node found. Initial Seed node has been placed with cid:: " + fetchSP);
  console.log("Waiting for User 1...Check back later.");
}
else { // (!!!) We have our encoding algorithm to place nodes. Need to provide input for message (later).
  let msg = "e|";
  cidArr = [];

  for (let char of msg) {
    for (let bit of cMap.get(char)) {
      offsetStr = ("||" + offsetIndex + "||" + bit);
      console.log(offsetStr);
      let hold = await ipfs.block.put( phrase2buf(seedPhrase+offsetStr) ,{format:"dag-cbor",mhtype:"sha2-256", version:1});
      let hold2 = gencid(seedPhrase+offsetStr);
      cidArr.push(hold);
      cidArr.push(hold2);
      offsetIndex+=1;
    }
  }
  console.log(cidArr);
}

console.log("Decode Results:" + "----------------");


//Decode Algorithm. Place in another file later (!!!)
//we need to generate probable offsets.
//Outer loop: look for termination character.
//Inner Loop: look for 6 bits code, and check cMap.
/*
cidArr = [];

let termcharfound = false;
offsetIndex = 0;
let bitArr = ["0","1"];
let codeStr; let foundMsg = ""; let guessCID;
while (!termcharfound) {
  for (let i = 0; i < 6; i++) { //just reuse offsetStr and offsetIndex
    for (let bit in bitArr) {
      offsetStr = ("||" + offsetIndex + "||" + bit);
      guessCID = gencid( phrase2buf(seedPhrase+offsetStr) );
      console.log("offsetSTR= " + offsetStr);
      cidArr.push(guessCID);
      //if (guessblock(guessCID)) { codeStr+=bit;}
    }
    offsetIndex+=1;
  }
  termcharfound = true;
  foundMsg+=cMap.get(codeStr);
  console.log("FM ::" + foundMsg);
  //if (cMap.get(codeStr) == "101011") { termcharfound = true;}

}
console.log(cidArr);
//console.log("Our found message is:: " + foundMsg);
*/
