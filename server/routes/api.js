const express = require('express');
const router = express.Router();

const Web3 = require('web3');
var web3;
if(typeof web3 !== 'undefined'){
  web3 = new Web3(web3.currentProvider);
}else{
  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8008"));
}

const solc= require('solc');


// lets define initial / root
router.get('/',(req,res)=>{
  res.send("Hi I retrieved initially");
});

router.get('/web3/init',(req,res)=>{
  var response = {
    status:"ok",
    web3data:web3.version.api
  }
  //dont need to pass web3 directly
  console.log(web3);
  res.send(response);
})

router.get('/web3/contract/compile',(req,res)=>{
  var contractfile = 'pragma solidity ^0.4.19; contract Hello{ event Print(string out); function() public { Print("Hello solidity"); } }';
  //to compile
  var contract = solc.compile(contractfile,1);

  var jsonTemp = [];
  for (var contractName in contract.contracts) {
    // code and ABI that are needed by web3
    console.log(contractName + ': ' + contract.contracts[contractName].bytecode)
    console.log(contractName + '; ' + JSON.parse(contract.contracts[contractName].interface))
    jsonTemp.push({
      bytecode:contract.contracts[contractName].bytecode,
      interface:JSON.parse(contract.contracts[contractName].interface)
    });
  }

  var response = {
    status:'ok',
    contract:jsonTemp
  }

  res.send(response);
});

module.exports = router;


















