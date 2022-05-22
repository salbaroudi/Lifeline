# Introduction:

This is a project submission for the [L2Rollathon Hackathon][l2link] that was run during
May 2022.  The purpose of this project is to get familiar with Solidity, IPFS, and building dynamic front-end apps.


# Project Idea:

Chat apps that are built to illustrate IPFS/web3 concepts are not exactly novel. This particular chat app aims to implement the following:

My project idea involved the usage as a seed-phrase only (agreed upon by two parties), as a way of communicating on the IPFS network.

It would work as follows: Two parties select a seed phrase, and one party hash the seed-phrase to generate an initialization block. As both parties have a seed phrase – they can generate the same hash and check periodically if the initialization block has been placed.To communicate with each other, both parties agree to communicate with an established protocol – We send a coded message via hashing a *[ seedPhrase+offset+character code ]*. To send a message, one participant will place a series of encoded blocks. The receiver must *“guess”* the blocks, by iterating through hash blocks according to the protocol. If a block exists, then we have found a character in the sender’s message.
The idea was to communicate safely via obscurity (who would block such an esoteric thing?), and send short messages to another party without relying on chat programs or the usual networks. However, there are a number of practical issues with this:

1) It can be computationally intensive to “guess” messages – and it spams the IPFS network in some ways. Messages can take a long time to come through.

2) Each participant would have to also share a local node – as the peer network will not host random blocks without payment, or prior agreement.

3) An intermediary (smart contract) – would have to buy storage space from a provider – and the two parties would have to decide how the ETH payment would be used for this.

4) Project relies on obscurity to communicate – but there are a lot of attack surfaces that need hardened for this to actually work.

5) Testing for the existence of a block is not an easy or time efficient thing in IPFS, due to its asynchronous and distributed nature. To do this, I rely on ignoring thrown time-out errors
from the *IPFS.block.get()* function. This creates an hacky implentation - using IPFS in a way that it wasn't really designed for.

# Result:

Ultimately, the project did not succeed. There are many front-end / other crypto node modules that I need to learn to put together a successful web3 project. This became evident to me during the development.

In the end, I realized that I was building a web2.0 project that just hooked into an IPFS local node - which is **not the point of the hackathon, nor is it me walking the path towards web3 development.**.

So the project was stopped. I was able to demonstrate that my protocol worked - with basic test scripts, however.


[l2link]: https://gitcoin.co/hackathon/rollathon/onboard
