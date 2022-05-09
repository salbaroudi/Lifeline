/*
Quick implementation to play with the crypto library.

Everything hardcoded, just encrypt / decrypt, and upload/read from web3.storage!

State bit set just to go from encryption to decryption - no time for argv.

Encryption Code taken from:
https://nodejs.org/api/crypto.html#class-cipher
https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/

*/

import { readFileSync, writeFile } from "fs";
const { scrypt, randomFill, createCipheriv } = await import('node:crypto');

const encrypt = 1;
const web3APIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxZEI5M0UxNmUxQkEzNTYyRTZCMENBZjJiMWRhOGYxRDVBRTU4MTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIwOTUxOTczNjAsIm5hbWUiOiJTdGFydFRva2VuIn0.jRBEYSaOi2htHA-DbAKh067QNOYlTFer0-4C8gZTqwo";

if (encrypt == 1) {
  //List two basic Ethereum 128 bit public keys. Pulled from Ganache.
  let user1EthAddr = "0x2283aD30f3Aa263631b9CD2A9a64b12F67200B88";
  let user2EthAddr = "0x04007Df4ebf10B56f142312B06F5Ab3D4C8ecE06";

  //lets build a basic text to encrypt. Read in the file.
  //Exerpt taken from: https://astralcodexten.substack.com/p/every-bay-area-house-party?s=r
  let plaintext = "";
  try {
    let chatString = readFileSync('./fileuploads/plaintext.txt', 'utf8');
    plaintext = chatString;
  } catch (err) {
    console.error(err);
  }
  console.log(plaintext);
  const algorithm = 'aes128';
  const password = '2 password used to generate key';

  // First, we'll generate the key. The key length is dependent on the algorithm.
  // In this case for aes128, it is 16 bytes (128 bits).
  let ciphertext = "";
  scrypt(password, 'salt', 16, (err, key) => {
    if (err) throw err;
    // Then, we'll generate a random initialization vector
    randomFill(new Uint8Array(16), (err, iv) => {
      if (err) throw err;

      const cipher = createCipheriv(algorithm, key, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      //Now we write that encrypted data back to a ciphertext.txt file!
      //apparently writeFileSync will just clobber over by default
      //https://stackoverflow.com/questions/43892482/whats-the-best-way-to-overwrite-a-file-using-fs-in-node-js
      //can just slam a string into it -  no need for special buffers.
      writeFile('./fileuploads/ciphertext.blab', encrypted, (err) => {
      if (err) throw err;
      console.log('Written!!');
      });
    });
  });






}


//Basic key and initialization vector.

//Call algorithm, write encyrpted text to buffer.

//Else, decrypt.
