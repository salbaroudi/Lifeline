# Introduction:

This is a project submission for the [L2Rollathon Hackathon][l2link] that was run during
May 2022.  The purpose of this project is to get familiar with Solidity, IPFS, and building dynamic front-end apps.


# Project Outline:

Chat apps that are built to illustrate IPFS/web3 concepts are not exactly novel. This particular chat app aims to implement the following:

* BIP-39-like password system - using mnemonic sequences of words for two users to establish an secret key and a channel in which to chat.
* Only two users with initial ETH addresses may participate in the chat. These are stored hashed, so if a thrid party discovers the key phrase, they still don't have the correct addresses to participate.
* Simple ETH wallet integration (MetaMask) - so that the two participants may pay for
pinning services periodically, or send money to one another.
* Encrypted image or chat log in binary file (".blab" file). This is a fixed size file which is re-added to the underlying IPFS. Filesize is kept small to minimize any fees.

# Technologies Used:

web3.storage, http-server, jsipfs and ipfs-http modules, Browserify, rimraf.



[l2link]: https://gitcoin.co/hackathon/rollathon/onboard
