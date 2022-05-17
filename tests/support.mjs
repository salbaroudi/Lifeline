//support.js
import * as crypto from 'node:crypto';

let gencharmap = function() {
  const cMap = new Map();
  for (let i = 0; i < 26; i++) {
    cMap.set((i.toString(2)).padStart(6,"0"),String.fromCharCode(97+i));
    cMap.set(String.fromCharCode(97+i),(i.toString(2)).padStart(6,"0"));
  }

  for (let i = 0; i < 10; i++) {
    cMap.set(((26+i).toString(2)).padStart(6,"0"),String.fromCharCode(48+i));
    cMap.set(String.fromCharCode(48+i),((26+i).toString(2)).padStart(6,"0"));
  }

  //odd characters
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

/*
const sha256 = hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => new Uint8Array(crypto.createHash('sha256').update(input).digest())
})

let phrase2buf = function(phrase) {
  return new TextEncoder().encode(phrase);
}

/*
let gencid = function(phrase) {
  //const buf = phrase2buf(phrase);
  const hash = sha256.digest(buf);
  return  CID.create(1, 0x71, hash); //version, codec, hash...
}


let gencid = function(buf) {
  //const buf = phrase2buf(phrase);
  const hash = sha256.digest(buf);
  return CID.create(1, 0x71, hash); //version, codec, hash...
}
*/
let guessblock = async function(cid,to) {
  let guessCID; let result = false;
  try {
    guessCID = await ipfs.block.get(cid,{timeout:to});
    //We found something.
    result = true;

  } catch (e) {  } //Don't care about timeout errors. Just return false.
  return result;
}

export { gencharmap, guessblock };
