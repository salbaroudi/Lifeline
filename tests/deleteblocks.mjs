import * as IPFS from "ipfs-core";


const ipfs = await IPFS.create();


let delfun = async function() {
  for await (const result of ipfs.files.ls("/")) {
    console.log(result);
    //const result = ipfs.block.rm(cid, {force: true});
    //if (result.error) {
    //  console.error(`Can't remove block ${result.cid}`);
    //}
  }
}

delfun();
