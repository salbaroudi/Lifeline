import * as IPFS from "ipfs-core";
import { gencharmap, guessblock, sha256, gencid, tEnc } from "./support.mjs";

const ipfs = await IPFS.create();
const cMap = gencharmap();
const timeoutms = 1000;
//let offsetIndex = 0; let offsetStr;

//*Functions

let encodemessage = async function(sP,msg,printout=0) {
  let cidArr = []; let offsetIndex = 0; let offsetStr;
  for (let char of msg) {
    for (let bit of cMap.get(char)) {
      offsetStr = ("||" + offsetIndex + "||" + bit);
      let hold = await ipfs.block.put(tEnc.encode(sP+offsetStr),{format:"dag-cbor",mhtype:"sha2-256", version:1});
      let hold2 = gencid(sP+offsetStr);
      cidArr.push(hold);
      //cidArr.push(hold2);
      offsetIndex+=1;
    }
  }
  if (printout) {
    console.log("CIDs Generated::");
    console.log(cidArr);
  }
  return
}

//Our Test Phrase:
const seedPhrase = "oxencatfishmouseseagullpenironpotbookpooldammallgazeboaloofformalcandidcaustic";

//Need to check if seed node exists. A thrown timeout error means we likely have no node.
let cidSP = gencid(seedPhrase);
let initiate = false; let fetchState; let cidArr;

try {
  fetchState = await ipfs.block.get(cidSP,{timeout:timeoutms});
  (fetchState != null)? initiate=true:null;
} catch (e) {} //no need to recover - nothing is present.

if (!initiate) {
  fetchSP = await ipfs.block.put(tEnc.encode(seedPhrase),{format:"dag-cbor",mhtype:"sha2-256", version:1});
  console.log("No seed node found. Initial Seed node has been placed with cid:: " + fetchSP);
}
else { // (!!!) We have our encoding algorithm to place nodes. Need to provide input for message (later).
  let msg = "h|";
  await encodemessage(seedPhrase,msg,1);
}

console.log("Decode Results:" + "----------------");
ipfs.repo.gc();

for await (const ref of ipfs.refs.local()) {
  if (ref.err) {
    console.error(ref.err)
  } else {
    console.log(ref.ref)
  }
}


//Decode Algorithm. Place in another file later (!!!)
//we need to generate probable offsets.
//Outer loop: look for termination character.
//Inner Loop: look for 6 bits code, and check cMap.
//let holder = await ipfs.block.get(CID.parse("bafyreib655a5bhhh5sobxobvkavhg3s6w5jfefog7oguj4d2fhvxfmspyu"),{timeout:timeoutms});
//console.log("Fetching one block for a test: " + holder);

/*
cidArr = [];
let termcharfound = false;
let offsetIndex = 0; let offsetStr;
let bitArr = ["0","1"];
let codeStr; let foundMsg = ""; let guessCID;

while (!termcharfound) {
  for (let i = 0; i < 6; i++) { //just reuse offsetStr and offsetIndex
    for (let bit in bitArr) {
      offsetStr = ("||" + offsetIndex + "||" + bit);
      guessCID = gencid(seedPhrase+offsetStr);
      //console.log("offsetSTR= " + offsetStr);
      cidArr.push(guessCID);
      if (guessblock(guessCID)) { codeStr+=bit;}
    }
    offsetIndex+=1;
  }
  termcharfound = true;
  foundMsg+=cMap.get(codeStr);
  console.log("FM :: " + foundMsg);
  //if (cMap.get(codeStr) == "101011") { termcharfound = true;}
  codeStr = "";
}
console.log(cidArr);
//console.log("Our found message is:: " + foundMsg);
*/
