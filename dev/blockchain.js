const sha256 = require('sha256');

function BlockChain() {
	this.chain = [];
	this.newTransactions = [];
	createBlock(100, '0', '0');
}



// Basically this createBlock method will create a new block and inside of that block we have transaction and new transaction after creating the new block we simply just put it into the chain.
BlockChain.prototype.createBlock = function(nonce, previousBlockHash, hash) {
	const newBLock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.newTransactions,
		nonce: nonce, // noonce is proof of work.
		hash: hash,
		previousBlockHash: previousBlockHash,
	};

	this.newTransactions = [];
	this.chain.push(newBLock);

	return newBLock;

}

BlockChain.prototype.getLastBlock = function () {
	return this.chain[this.chain.length - 1];
}

BlockChain.prototype.createNewTransaction = function (amount, sender, recipent) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipent: recipent,
	};
	this.newTransactions.push(newTransaction);
	return this.getLastBlock()['index'] + 1;
}


BlockChain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	
	return hash;
}


BlockChain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

	while(hash.substring(0, 4) != '0000') {
		nonce++,
		hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
	}
	return nonce;
}


// Let's test this create block method

module.exports = BlockChain;