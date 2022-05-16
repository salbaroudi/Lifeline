import * as IPFS from "ipfs-core";
import { gencharmap, gencid, phrase2buf, guessblock } from "./support.mjs";

const ipfs = await IPFS.create();
const cMap = gencharmap();
const timeoutms = 100;
let offsetIndex = 0; let offsetStr;

//Our Test Phrase:
const seedPhrase = "oxencatfishmouseseagullpenironpotbookpooldammallgazeboaloofformalcandidcaustic";

//Need to check if seed node exists. A thrown timeout error means we likely have no node.
let cidSP = gencid(seedPhrase);
let initiate = false;
let fetchState;
try {
  fetchState = await ipfs.block.get(cidSP,{timeout:timeoutms});
  (fetchState != null)? initiate=true:null;
} catch (e) {} //no need to recover.

if (!initiate) {
  fetchSP = await ipfs.block.put(phrase2buf(seedPhrase));
  console.log("No seed node found. Initial Seed node has been placed with cid:: " + fetchSP);
  console.log("Waiting for User 1...Check back later.");
}
else { // (!!!) We have our encoding algorithm to place nodes. Need to provide input for message (later).
  let msg = "e|";
  let cidArr = [];

  for (let char of msg) {
    for (let bit of cMap.get(char)) {
      offsetStr = ("||" + offsetIndex + "||" + bit);
      cidArr.push(await ipfs.block.put(phrase2buf(seedPhrase+offsetStr)));
      offsetIndex+=1;
    }
  }
  console.log(cidArr);
}

//Decode Algorithm. Place in another file later (!!!)
//we need to generate probable offsets.
//Outer loop: look for termination character.
//Inner Loop: look for 6 bits code, and check cMap.

let termcharfound = false;
offsetIndex = 0;
let bitArr = ["0","1"];
let codeStr; let foundMsg = ""; let guessCID;
while (!termcharfound) {
  for (let i = 0; i < 6; i++) { //just reuse offsetStr and offsetIndex
    for (let bit in bitArr) {
      offsetStr = ("||" + offsetIndex + "||" + bit);
      guessCID = gencid(phrase2buf(seedPhrase+offsetStr));
      if (guessblock(guessCID)) { codeStr+=bit;}
    }
    offsetIndex+=1;
  }
  foundMsg+=cMap.get(codeStr);
  console.log("FM ::" + foundMsg);
  if (cMap.get(codeStr) == "101011") { termcharfound = true;}
}

console.log("Our found message is:: " + foundMsg);
