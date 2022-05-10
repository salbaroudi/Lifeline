/*
Quick implementation to play with the crypto library.

Everything hardcoded, just encrypt / decrypt, and upload/read from web3.storage!

State bit set just to go from encryption to decryption - no time for argv.

Timeit library used to measure decryption / encryption time for long logs:
https://www.npmjs.com/package/timeit-js
usage: let timems =  timeit(fn, args=[a, b, c], options={e: 1, r: 1, d: 6});

Encryption Code taken from:
https://nodejs.org/api/crypto.html#class-cipher
https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
*/

import { readFileSync, writeFile } from "fs";
const { scryptSync, createCipheriv, createDecipheriv } = await import('node:crypto');
//import * as tt from 'timeit-js';

const encrypt = 1;
const web3APIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxZEI5M0UxNmUxQkEzNTYyRTZCMENBZjJiMWRhOGYxRDVBRTU4MTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIwOTUxOTczNjAsIm5hbWUiOiJTdGFydFRva2VuIn0.jRBEYSaOi2htHA-DbAKh067QNOYlTFer0-4C8gZTqwo";
const algorithm = 'aes128';
const password = '2 password used to generate key';
const iv = Buffer.alloc(16, 0);
iv[1]=1;iv[3]=1;iv[6]=1;iv[7]=1;iv[9]=1;iv[14]=1;
let key = scryptSync(password, 'salt', 16); //this derives a password.

//List two basic Ethereum 128 bit public keys. Pulled from Ganache.
let user1EthAddr = "0x2283aD30f3Aa263631b9CD2A9a64b12F67200B88";
let user2EthAddr = "0x04007Df4ebf10B56f142312B06F5Ab3D4C8ecE06";


if (encrypt == 1) {

  //lets build a basic text to encrypt. Read in the file.
  //Exerpt taken from: https://astralcodexten.substack.com/p/every-bay-area-house-party?s=r
  let chatString = readFileSync('./fileuploads/plaintext.txt', 'utf8');
  console.log(chatString);

  // First, we'll generate the key. The key length is dependent on the algorithm.
  // In this case for aes128, it is 16 bytes (128 bits).
  // scrypt() requires a callback - don't use for now.

  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(chatString, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  /*
  let timems =  tt.timeit(cipher.update, [chatString, 'utf8', 'hex'], {e: 1, r: 1, d: 6});
  console.log("CipherUpdateTime = " + timems);
  */


  //Now we write that encrypted data back to a ciphertext.txt file!
  //apparently writeFileSync will just clobber over by default
  //https://stackoverflow.com/questions/43892482/whats-the-best-way-to-overwrite-a-file-using-fs-in-node-js
  //can just slam a string into it -  no need for special buffers.
  writeFile('./fileuploads/ciphertext.blab', encrypted, (err) => {
      if (err) throw err;
        console.log('Written!!');
      });
}
else {
  //Read encrypted file
  let encString = readFileSync('./fileuploads/ciphertext.blab', 'utf8');

  //decryption time naow.
  const decipher = createDecipheriv(algorithm, key, iv);

  // Encrypted using same algorithm, key and iv.
  let decrypted = decipher.update(encString, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  //Print to console.
  console.log(decrypted);
}
