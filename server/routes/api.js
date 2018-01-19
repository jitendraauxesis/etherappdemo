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
  res.header("Access-Control-Allow-Origin","*");
  // var contractfile = 'pragma solidity ^0.4.19; contract Hello{event Print(string out); string message; function() public {Print("Hello solidity"); } function printMessage() public returns(string message){message = "Hi this is remix ide"; return string(message); } function myFunction() returns(uint256 myNumber, string myString) {return (23456,"Hello!%"); } }';
  var contractfile = 'pragma solidity ^0.4.19; contract Employee {string name; string designation; function setEmployeeDetail(string _name,string _designation) public{name = _name; designation = _designation; } function getEmployeeDetail() public constant returns(string,string){return (name,designation); } }';


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
    // contract:jsonTemp,
    bytecode:jsonTemp[0].bytecode,
    interface:jsonTemp[0].interface,
    contract:contract
  }

  res.send(response);
});

module.exports = router;


















