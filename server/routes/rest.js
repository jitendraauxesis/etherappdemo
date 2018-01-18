const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios'); //for communication web servers

var Web3 = require('web3');
var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8008"));
}

const solc = require('solc');
const Tx = require('ethereumjs-tx');
const ethers = require('ethers');
const Buffer = require('buffer');
const EthJS = require('ethjs');

const API = 'https://jsonplaceholder.typicode.com';
const API2 = 'http://104.236.95.166:8000';

var n = 1;
/* GET api listing. */



router.get('/', (req, res) => {
  // console.log(web3)
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
      web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8008"));
  }
  // console.log(web3);
  res.send('api works');
});

router.get('/test',(req,res)=>{
  
  var op = JSON.parse(JSON.stringify({status:"ok","message":"fine","web3":web3.eth.accounts[0]}))
  res.send(op)
})

router.get('/web3/contract',(req,res)=>{

  var contractSolidity = 'pragma solidity ^0.4.19; contract Hello {event Print(string out); function() public { Print("Hello ethereum"); } }';
  var output = solc.compile(contractSolidity, 1);
   

  var op = JSON.parse(JSON.stringify({status:"ok","message":"fine","solc":solc,"contracts":output}))
  res.send(op)
})

router.get('/web3/deploy',(req,res)=>{
  var data;
  
  var abi = [{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"out","type":"string"}],"name":"Print","type":"event"}];
  var code = { "linkReferences": {}, "object": "60606040523415600e57600080fd5b60a480601b6000396000f30060606040523415600e57600080fd5b7f241ba3bafc919fb4308284ce03a8f4867a8ec2f0401445d3cf41a468e7db4ae060405180806020018281038252600e8152602001807f48656c6c6f20657468657265756d00000000000000000000000000000000000081525060200191505060405180910390a10000a165627a7a7230582027a74f4676f1c2335887b2fe50b6c4be31c3297b43cbda42999e9363f61175150029", "opcodes": "PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH1 0xE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0xA4 DUP1 PUSH1 0x1B PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH1 0xE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH32 0x241BA3BAFC919FB4308284CE03A8F4867A8EC2F0401445D3CF41A468E7DB4AE0 PUSH1 0x40 MLOAD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0xE DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x48656C6C6F20657468657265756D000000000000000000000000000000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 STOP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 0x27 0xa7 0x4f 0x46 PUSH23 0xF1C2335887B2FE50B6C4BE31C3297B43CBDA42999E9363 0xf6 GT PUSH22 0x15002900000000000000000000000000000000000000 ", "sourceMap": "25:86:0:-;;;;;;;;;;;;;;;;;" };
  var bytecode = "60606040523415600e57600080fd5b60a480601b6000396000f30060606040523415600e57600080fd5b7f241ba3bafc919fb4308284ce03a8f4867a8ec2f0401445d3cf41a468e7db4ae060405180806020018281038252600e8152602001807f48656c6c6f20657468657265756d00000000000000000000000000000000000081525060200191505060405180910390a10000a165627a7a7230582027a74f4676f1c2335887b2fe50b6c4be31c3297b43cbda42999e9363f61175150029";
  
  var contract_address = "0xc0ffb3862bf5afb62ce780504daf9b946e15148b";
  
  var contract = new web3.eth.contract(abi);
  // console.log("contract",contract)
  
  const contractData = contract.new.getData({
    data: '0x' + bytecode
  });
  // console.log("contractdata",contractData)
  const gasLimit = 5302200;
  const gasPrice = 1800000000999999;
  const gasPriceHex = web3._extend.utils.toHex(gasPrice);
  const gasLimitHex = web3._extend.utils.toHex(gasLimit);
  const nonce = 48;
  const nonceHex = web3._extend.utils.toHex(nonce);

  //make private key and wallet
  var priv = web3.sha3("Hi ng+node");
  var wallet = new ethers.Wallet(priv);
  // console.log(ppkey,wallet)

  //node address
  var nodeaddress = web3.eth.accounts[0];
  var getbal = web3.eth.getBalance(nodeaddress);
  console.log("fromaddress",nodeaddress,wallet)
  // console.log("amount",web3.eth.getBalance(nodeaddress)+" ether")

  const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: contractData,
    from: nodeaddress
  };
  const tx = new Tx(rawTx);
  console.log("tx",tx)
  var pk = priv.toString();
  pk = pk.substr(2,pk.length);
  pk = Buffer.Buffer.from(pk,'hex');
  tx.sign(pk);
  const serializedTx = tx.serialize();
  // console.log("seril",web3)
  // web3.eth.sign('0x' + serializedTx.toString("hex"))
  // .on('receipt', console.log);
  var status = "ok";
  var resp;
  web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, hash){
      //console.log('contract creation tx1: ' + hash);
    if (err) {
      status = "fail";
      resp = err;
      console.log(err); return;
    }
    // Log the tx, you can explore status manually with eth.getTransaction()
    status = "ok";
    console.log('contract creation tx2: ' + hash);
    const receipt = web3.eth.getTransactionReceipt(hash);
    console.log('contract address: ' + receipt.contractAddress);
    resp = receipt.contractAddress;
  });

  data = {status:status,"balance":getbal+" ether","data":resp,"errorcode":status,"rawtx":rawTx,"tx":tx};

  var op = JSON.parse(JSON.stringify(data));
  res.send(op);
});

router.get('/p',(req,res)=>{
   web3 = new Web3(new Web3.providers.HttpProvider("http://139.59.213.205:7007"));
      let addressLocal =  "0x95BBEfa6Ae643E415cf9F8DCc05f23C8028c8Bcc";
      let pkeyLocal = "0x7986c6864c73791a69bbf7232eaf23ac058c5281c2b8f477e5b0b711b511e7c2";
      // console.log(addressLocal,pkeyLocal)
      if(addressLocal == "" || addressLocal == null || pkeyLocal == "" || pkeyLocal == null){
        // reject({status:"failed"})
      }else{
        var flag = true;
				var iter = 0;
				var cont_address = "0x1878118d8Ca53E7f2c1d876140B1ce300ac877dC";
				const abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ClaimApprovers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalFund","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"Peers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"Claim","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ClaimVotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Claims","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Settled","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"LastClaimed","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"claiming_user","type":"address"}],"name":"getClaimAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"approval_address","type":"address"}],"name":"ApproveAtomic","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"claiming_user","type":"address"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reimbursing_address","type":"address"},{"indexed":false,"name":"claim_amount","type":"uint256"}],"name":"Reimbursed","type":"event"}];
				var contract =   web3.eth.contract(abi).at(cont_address);
				// console.log("contract",contract)
        // var contract = this.abiforuser();
        console.log("contract",contract.Peers(1))
        // while (flag){
        for(iter=0;iter<10;iter++){
          console.log("flagfalse "+iter,flag,contract.Peers(iter))          
          if (contract.Peers(iter) == "0x") {
            flag = false;
            console.log("flagfalse "+iter,flag)
            break;
          }
          else{
            iter++;
            // console.log("flagitr",flag,iter)
          }
          // console.log("flagwhlle",flag)
        }
        
        console.log({
          status:"ok",
          data:{
            peer:iter,
            add_bal:web3.fromWei(web3.eth.getBalance(addressLocal)) + ' ethers',
            total:web3.fromWei(contract.totalFund()) + ' ethers',
            premium:web3.fromWei(contract.Balance(addressLocal)) + ' ethers',
            claim:web3.fromWei(contract.getClaimAmount(addressLocal)) + ' ethers',
            claim_status:contract.Claims(addressLocal),
            claim_approvers:contract.ClaimApprovers(addressLocal),
            claim_votes:contract.ClaimVotes(addressLocal)
          }
				});
      }
  res.send('api works for web3');    
})

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/soldtoken',(req,res) =>{
  axios.post(`${API2}/get_total_tokens_sold`,{})
  .then(data=>{
    console.log(data)
    // return data;
    res.status(200).json(data.data);
  })
  .catch(error=>{
    console.warn(error)
    // return error;
    res.status(500).send(error);
  })
})

// Get all posts
router.get('/posts2', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/incr',(req,res)=>{
	setInterval(()=>{
			n = n + 1;
	},2000);
	res.status(200).json(n);
})

module.exports = router;