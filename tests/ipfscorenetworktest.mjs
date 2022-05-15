//Load IPFS core module with ES import.
import * as IPFS from "ipfs-core";

const ipfs = await IPFS.create();
const { cid } = await ipfs.add("HI ALL!"); //deobjecting a promise.
console.info(cid);

//Lets get some swarm data:
const multiAddrs = await ipfs.swarm.localAddrs();
console.log("Local addresses we are listening on:" + multiAddrs);

//Produces a lot of different addresses. We are not connected to all of them.
/*
const peerInfos = await ipfs.swarm.addrs();
peerInfos.forEach(info => {
  console.log(info.id)
  info.addrs.forEach(addr => console.log(addr.toString()))
  });
*/

const ourPeers = await ipfs.swarm.peers();
ourPeers.forEach(peerObj => {
  console.log("MultiAddr= " + peerObj.addr);
  console.log("Peer= " + peerObj.peer);
  console.log("Direction= " + peerObj.direction);
});

//Try disconnecting from a peer, from our addrs list.
/*console.log("Disconnecting from a peer");
await ipfs.swarm.disconnect("/ip4/18.217.89.46/tcp/30006/p2p/12D3KooWRLsZVnBrR4FdFLSatFZDiqbUSvc4ePyHiLDt2b2uVrKm");
*/
//Test Seed phrase
let seedPhrase = "canarymoleseagullwallabieetcetc...";
let pCounter = 0;

//Now check to see if this node exists: Persistance?


//Put our initialization node on the local node
const obj = { msg: seedPhrase  };
const cid2 = await ipfs.dag.put(obj)
console.log(cid2.toString())

//Now check to see if this node exists:
const result = await ipfs.dag.get(cid2)
console.log(result.value)


//See if files exist.
