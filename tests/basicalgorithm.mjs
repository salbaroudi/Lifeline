//In this file, we outline our character mapping, and run the basic algorithm.
//We will only have one client to start - which will post the message and then
//run the discovery algorithm to read it back.

import * as IPFS from "ipfs-core";
import { CID } from 'multiformats/cid';
import * as hasher from 'multiformats/hashes/hasher';
import * as crypto from 'node:crypto';

const ipfs = await IPFS.create();

const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

const cMap = new Map();
const frameLength = 45;

//charMap - letters.
for (let i = 0; i < 26; i++) {
  cMap.set(i,String.fromCharCode(97+i));
  cMap.set(String.fromCharCode(97+i),i);
}
//numbers
for (let i = 0; i < 10; i++) {
  cMap.set(26+i,String.fromCharCode(48+i));
  cMap.set(String.fromCharCode(48+i),26+i);
}
//odd characters
cMap.set(36,String.fromCharCode(33)); cMap.set(String.fromCharCode(33),36); // !
cMap.set(37,String.fromCharCode(39)); cMap.set(String.fromCharCode(39),37); // ''
cMap.set(38,String.fromCharCode(45)); cMap.set(String.fromCharCode(45),38); // -
cMap.set(39,String.fromCharCode(46)); cMap.set(String.fromCharCode(46),39); // .
cMap.set(40,String.fromCharCode(58)); cMap.set(String.fromCharCode(58),40); // :
cMap.set(41,String.fromCharCode(47)); cMap.set(String.fromCharCode(47),41); // /
cMap.set(42,String.fromCharCode(63)); cMap.set(String.fromCharCode(63),42); // ?
cMap.set(43,String.fromCharCode(124)); cMap.set(String.fromCharCode(124),43); // | Term Char
cMap.set(44,String.fromCharCode(32)); cMap.set(String.fromCharCode(32),44);//space


//Ordered traversal array. //Frequent Letters - space - less freq letters - term character - freq numbers, symbols (ordering).
const cArr = [4,19,0,14,8,44,13,18,7,17,3,11,2,20,12,22,5,6,24,15,1,21,10,43,9,23,16,25,27,26,28,29,30,31,32,33,34,35,36,37,38,39,40,41];

//To create a message, we offset our seed phrase by a charater, and hash each string - adding them along the way.
//User two will "guess" the message by checking existance.
//Balancing timeout time is our most critical factor for this method of communication.

const seedPhrase = "oxencatfishmouseseagullpenironpotbookpooldammallgazeboaloofformalcandidcaustic";

//First we check to see if our init node exists.
//------------
const bufSP = new TextEncoder().encode(seedPhrase);
const hashSP = await sha256.digest(bufSP);
//console.log("json.encode:" + json.encode(obj))
const cidSP = CID.create(1, 0x71, hashSP) //version, codec, hash...
let fetchSP; let placedSP;

try {
  fetchSP = await ipfs.block.get(cidSP,{timeout:1250});
} catch (e) {
  placedSP = await ipfs.block.put(bufSP);
  console.log("No init found - we placed a node with cid= " + placedSP);
}


//Now lets place our message nodes on the network.
let hasReqMsg = true;
const msg="signal received.need help?|";
//If we see a node, we need to send a message.
let offset = 0;
if (hasReqMsg==true) {
  //Message Placement Algorithm.
  let bufMsg; let hashMsg; let holdCID;

  for (let char of msg) {
    let offsetStr = (offset + cMap.get(char) + "");
    let bufMsg = new TextEncoder().encode(seedPhrase + "||" + offsetStr);

    hashMsg = await sha256.digest(bufMsg);
  //  console.log("For Character = " + char + "and offset =" + offset + "offsetSTR=" + offsetStr);
  //  console.log(CID.create(1, 0x71, hashMsg));
  //  console.log("----------");
    offset+=45;
  }
}

//Now lets decode the given message.
offset = 0;
let bufGuess; let hashGuess; let guessCID; let fetchGuess;
let terminated = false;
while (!terminated) {
  for (let num of cArr) {
    let offsetStr = (offset + num + "");
     bufGuess = new TextEncoder().encode(seedPhrase + "||" + offsetStr);
     hashGuess = await sha256.digest(bufGuess);
     guessCID = CID.create(1, 0x71, hashGuess);

     try {
       fetchGuess = await ipfs.block.get(guessCID,{timeout:100});
       //We found something.
       if (num == 43) {
         terminated = true;
         break;
       }
       console.log("FOUND: " + cMap.get(num));
     } catch (e) {  } //Don't care about timeout errors.
  }
  offset+=45;
}
