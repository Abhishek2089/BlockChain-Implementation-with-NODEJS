// Accessing blockchain using apis

const express = require('express');
const bodyparser = require('body-parser');
const BlockChain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
uuidv4();
const app = express()
const bitcoin = new BlockChain();
const nodeAddress = uuidv4().split('-').join('');
// const port = process.argv[2];
const currentNodeUrl = process.argv[3];
const rp = require('request-promise');
const { json } = require('body-parser');



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function(req, res) {
    // const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    // res.json({ note: `Transaction will be added in block ${blockIndex}.`});
    const newTransaction = req.body;
    // bitcoin.addTransactionToPendingTransaction(newTransaction);
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({note: `Transaction will be added ${blockchain}.`})
});

app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            uri: networkNodeUrl + '/recieve-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true,
        };

        requestPromises.push(rp(requestOption));

        Promise.all(requestPromises).then(data => {
            const requestOption = {
                uri: bitcoin.currentNodeUrl + 'transaction-broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true,
            };

            return rp(requestOption);
        })
    })

    res.json({
        note: 'Block is mined successfully',
        block: newBlock,
    });

    bitcoin.createNewTransaction(12.5, "00", nodeAddress);
});

app.post('/recieve-block', function(req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if(correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
    }
    res.json({
        note: 'New Block Added succesfully',
        newBlock: newBlock
    });
})

// creating multiple nodes

// creting /register and broadcast nodes

app.post('/register-and-broadcast', function(req,res) {
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(newNodeUrl => {
        const requestOption = {
            uri: networkNodes + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };
        regNodesPromises.push(rp(requestOption));
    });
    Promise.all(regNodesPromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetwrokNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json: true
        }
    return rp(bulkRegisterOptions); 
    });  

app.post('/register-nodes', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.networkNodes.currentNodeUrl != newNodeUrl;
    if(nodeNotAlreadyPresent && nodeNotAlreadyPresent) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    res.json({ note: 'New Node registered successfully'});
});

app.post('/register-nodes-bulk', function(req, res) {
    const allNetwrokNodes = req.body.allNetwrokNodes;
    allNetwrokNodes.forEach(networkNodeUrl => {
        const notAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentUrl = bitcoin.currentNodeUrl != networkNodeUrl;
        if(notAlreadyPresent && notCurrentUrl) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });

    res.json({note: 'Bulk registration succesful'});
});
 
});

app.post('/transaction-broadcast', function(req, res) {
    const newTransaction = bitcoin.createNewTransaction(
        req.body.amount, 
        req.body.sender,
        req.body.recipient,
    );
    bitcoin.addTransactionToPendingTransaction(newTransaction);
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true,
        }

        requestPromises.push(requestOption);

        Promise.all(requestPromises).then(data => {
            res.json({note: 'Transaction is complete'})
        });
    });

});

app.get('/consensus', function(req, res) {
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            uri: networkNodes + '/blockchain',
            method: 'GET',
            json: true,
        }
        requestPromises.push(rp(requestOption));
    });
    Promise.all(requestPromises).then(blockchains => {
        const currrentChainLength = bitcoin.chain.length;
        let maxChainLength = currrentChainLength;
        let newLongestChain = null;
        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > currrentChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransaction = blockchain.pendingTransactions;
            };
            if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced',
                    chain: bitcoin.chain
                });
            } else {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransaction;
                res.json({
                    note: 'Chain has been replaced',
                    chain: bitcoin.chain,
                });
            }
        })
    })
});

app.get('block:blockHash', function(req, res) {
    blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock,
    })
});

app.get('transaction:transactionId', function(req, res) {
    transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

app.get('address:address', function(req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);

    res.json({
        addressData: addressData
    })
});

app.get('/', function(req, res) {
    res.sendFile('./block-explorer/index.html', {root: __dirname});
});


app.listen(3000, function() {
    console.log(`Server is running on 3000`);
})