// Here we will testing our createBlock method

const BlockChain = require('./blockchain');
const bitcoin = new BlockChain();
const nonce = 100;
const previousBlockHash = 'dsgfgfgfdfdg';
const currentBlockData = [
    {
        amount:101,
        sender: 'dsghfhjh',
        recipient: 'dtruryrturt'
    },
    {
        amount:103,
        sender: 'dsghffdhjh',
        recipient: 'dtrufdryrturt'
    },
    {
        amount:111,
        sender: 'dsghuyiufhjh',
        recipient: 'dtruhjhjhryrturt'
    },
]
// bitcoin.hashBlock();
// bitcoin.createBlock(242, 'ewfdsdg', 'etwete2');
// bitcoin.createNewTransaction(100, 'dgsdgdsd', 'dgsgfsgsfd');
// bitcoin.createBlock(243, 'dfsdsfsgf', 'nknknkn');

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData, nonce));