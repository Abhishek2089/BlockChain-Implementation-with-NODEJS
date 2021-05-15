const sha256 = require('sha256');
const { v4: uuidv4 } = require('uuid');
uuidv4();

function BlockChain() {
	this.chain = [];
	this.pendingTransactions = [];

	this.currentNodeUrl = this.currentNodeUrl;
	this.networkNodes = [];
	this.createNewBlock();

}



// Basically this createBlock method will create a new block and inside of that block we have transaction and new transaction after creating the new block we simply just put it into the chain.
BlockChain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBLock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce, // noonce is proof of work.
		hash: hash,
		previousBlockHash: previousBlockHash,
	};

	this.pendingTransactions = [];
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
		transactionId: uuid().split('-').join(''),
	};

	return newTransaction;

	// this.pendingTransactions.push(newTransaction);
	// return this.getLastBlock()['index'] + 1;
}

BlockChain.prototype.addTransactionToPendingTransaction = function (transactionObj) {
	this.pendingTransactions.push(transactionObj);
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

BlockChain.prototype.chainIsValid = function(blockchain) {
	for(var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		if(currentBlock['previousBlockHash'] != prevBlock['hash']) {
			validChain = false;
		};

		const blockHash = this.hashBlock(prevBlock['hash'], {
			transactions: currentBlock['transactions'],
			index: currentBlock['index']
		}, currentBlock['nonce']);
		if(blockHash.substring(0, 4) !== '0000') {
			validChain = false;
		}

		const genesisBlock = blockchain[0];
		const correctNonce = genesisBlock['nonce'] == 100;
		const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
		const correctHash = genesisBlock['hash'] === '0';
		const correctTransactions = genesisBlock['transactions'] === 0;

		if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
			return chainIsValid = false;
		}

		return validChain;
	};
}


// Let's test this create block method

module.exports = BlockChain;