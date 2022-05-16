import * as IPFS from "ipfs-core";
import { CID } from 'multiformats/cid';
import {gencharmap, sha256} from "./support.mjs";
//const ipfs = await IPFS.create();

const cMap = gencharmap();
console.log(cMap);
console.log(sha256);
