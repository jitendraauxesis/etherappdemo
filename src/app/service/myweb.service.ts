import { Injectable } from '@angular/core';

import { HttpModule, Http  } from '@angular/http';
import 'rxjs/add/operator/map';

import Web3 from 'web3';
import *  as ethers from 'ethers';
import * as Tx from 'ethereumjs-tx';
import * as solc from 'solc';

var window;

import { MycryptoService } from './mycrypto.service';
import * as Buffer from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class MywebService {
  
  web3;

  constructor(
    public mycryptoService:MycryptoService,
    private http:Http
  ) { 
    if (typeof this.web3 !== 'undefined') {
        this.web3 = new Web3(this.web3.currentProvider);
    } else {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8008"));
    }
    console.log("this.web3",this.web3);
    // console.log(Buffer)
  }

  createAddressAndWallet(){
    let pkey = this.web3.sha3("Generate my private key using this string");
    console.log("Private key",pkey)
    //and wallet address
    let wallet = new ethers.Wallet(pkey);
    console.log(wallet)
    let address = wallet.address;
    console.log("Wallet address",address)

  }

  returnCompiledContract(){
    return new Promise((resolve,reject)=>{
      
      this.http.get("http://localhost:3000/api/web3/contract/compile")
      .map(res=>res)
      .subscribe(
        
        d=>{
          let dt = JSON.parse(JSON.stringify(d));
          let body = JSON.parse(dt._body);

          var number = this.web3.eth.getCompilers();
          console.log(number);

          // this.web3.eth.getAccounts().then(
          //   dd=>{
              let acc = "0x692a70d2e424a56d2c6c27aa97d1a86395877b3a"; 
              let abi = body.interface;
              let bytecode = body.bytecode;
              console.log("maincontract",body.contract);

              var contract = new this.web3.eth.Contract(abi);
 
              var contractData = contract.deploy({
                method:'constructor',
                data:'0x'+bytecode
              }).encodeABI();

              console.log(contract)
              console.info(contract.options.address);

              // let msg = '';
              // contract.methods.setEmployeeDetail("Abcd","efgh");
              // contract.methods.getEmployeeDetail().call()
              // .then(
              //   d=>{console.log(d)},
              //   e=>{console.log(e)}
              // )
              // .catch(e => console.log(e));
              // contract.methods.printMessage().call({},function(error,result){
              //   console.log(error)
              //   console.log(result)
              // })
              // .then(
              //   res=>{
              //     console.log(res)
              //   }
              // )
              // console.log("conttract msg");
              // console.log(msg)

              var resp = {
                status:"ok",
                contractData:contractData
              }
              resolve(resp)
            // },
            // ee=>{
            //   console.log(ee);
            // }
          // );

          

          


        },
        e=>reject(e)
      );

    })
  }

  acc():string{
    let acc;
    return this.web3.eth.getAccounts().then(
      dd=>{
        acc = dd[0];
        return acc;
      },
      ee=>{
        return ee;
      }
    );
  }
 
  rng () { return Buffer.Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }//http://127.0.0.1:8008http://139.59.213.205:7007

  btc(){
    console.log(bitcoin)

    var testnet = bitcoin.networks.testnet;
    var keyPair = bitcoin.ECPair.makeRandom({network:testnet});
    var address = keyPair.getAddress();
    console.log(address)
    var pkey = keyPair.toWIF();
    console.log(pkey)
  }

  createAddressAndWalletold(){
    var ppkey = this.web3.sha3("Hi ethereumjs-tx-1");
    var wallet = new ethers.Wallet(ppkey);
    wallet = wallet.address;
    console.log(ppkey,wallet)

    this.mycryptoService.saveToLocal("SISDumPrivateKey",ppkey);
    this.mycryptoService.saveToLocal("SISDumWalletAddress",wallet);
     

    var nodeaddress = this.web3.eth.accounts[0];
    // console.log(nodeaddress)
    // console.log("amount",this.web3.eth.getBalance(nodeaddress)+" ether")
    this.mycryptoService.saveToLocal("SISDumNodeAddress",nodeaddress);
  }

  deployContract(){
    // this.doTransaction();

    let address = this.mycryptoService.retrieveFromLocal("SISDumWalletAddress");
    let amnt = "0.2";
    console.log(address,amnt)
    this.sendEther(address,amnt).then(
      d=>{
        console.log(d)
      },
      e=>{
        console.error(e)
      }
    ).catch(
      e=>{
        console.error(e)
      }
    ) 
  }

  readContract(){
    return new Promise((resolve,reject)=>{
      this.http.get("assets/lib/contract.sol")
      .map(res=>res)
      .subscribe(
        d=>resolve(d),
        e=>reject(e)
      );
    });
  }

  readContractAddRemix(){
    let str = "0xc0ffb3862bf5afb62ce780504daf9b946e15148b";
    return str;
  }

  readFromRemix(){
    var abi = [
      {
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "out",
            "type": "string"
          }
        ],
        "name": "Print",
        "type": "event"
      }
    ];
    var bytecode = {
      "linkReferences": {},
      "object": "60606040523415600e57600080fd5b60a480601b6000396000f30060606040523415600e57600080fd5b7f241ba3bafc919fb4308284ce03a8f4867a8ec2f0401445d3cf41a468e7db4ae060405180806020018281038252600e8152602001807f48656c6c6f20657468657265756d00000000000000000000000000000000000081525060200191505060405180910390a10000a165627a7a7230582027a74f4676f1c2335887b2fe50b6c4be31c3297b43cbda42999e9363f61175150029",
      "opcodes": "PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH1 0xE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0xA4 DUP1 PUSH1 0x1B PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH1 0xE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH32 0x241BA3BAFC919FB4308284CE03A8F4867A8EC2F0401445D3CF41A468E7DB4AE0 PUSH1 0x40 MLOAD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0xE DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x48656C6C6F20657468657265756D000000000000000000000000000000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 STOP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 0x27 0xa7 0x4f 0x46 PUSH23 0xF1C2335887B2FE50B6C4BE31C3297B43CBDA42999E9363 0xf6 GT PUSH22 0x15002900000000000000000000000000000000000000 ",
      "sourceMap": "25:86:0:-;;;;;;;;;;;;;;;;;"
    };

    var helloContract = this.web3.eth.contract(abi);
    // this.web3.personal.unlockAccount(this.web3.eth.accounts[0]);
    var hello = helloContract.new(
       {
         from: this.web3.eth.accounts[0], 
         data: '0x60606040523415600e57600080fd5b60a480601b6000396000f30060606040523415600e57600080fd5b7f241ba3bafc919fb4308284ce03a8f4867a8ec2f0401445d3cf41a468e7db4ae060405180806020018281038252600e8152602001807f48656c6c6f20657468657265756d00000000000000000000000000000000000081525060200191505060405180910390a10000a165627a7a7230582027a74f4676f1c2335887b2fe50b6c4be31c3297b43cbda42999e9363f61175150029', 
         gas: '4700000'
       }, function (e, contract){
        console.log(e, contract);
        if (typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        }
    })

    console.log("contract",helloContract)
  }

  doTransaction(){
    var abi = [{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"out","type":"string"}],"name":"Print","type":"event"}];
    var code = { "linkReferences": {}, "object": "60606040523415600e57600080fd5b60a480601b6000396000f30060606040523415600e57600080fd5b7f241ba3bafc919fb4308284ce03a8f4867a8ec2f0401445d3cf41a468e7db4ae060405180806020018281038252600e8152602001807f48656c6c6f20657468657265756d00000000000000000000000000000000000081525060200191505060405180910390a10000a165627a7a7230582027a74f4676f1c2335887b2fe50b6c4be31c3297b43cbda42999e9363f61175150029", "opcodes": "PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH1 0xE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0xA4 DUP1 PUSH1 0x1B PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x60 PUSH1 0x40 MSTORE CALLVALUE ISZERO PUSH1 0xE JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH32 0x241BA3BAFC919FB4308284CE03A8F4867A8EC2F0401445D3CF41A468E7DB4AE0 PUSH1 0x40 MLOAD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0xE DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x48656C6C6F20657468657265756D000000000000000000000000000000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 STOP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 0x27 0xa7 0x4f 0x46 PUSH23 0xF1C2335887B2FE50B6C4BE31C3297B43CBDA42999E9363 0xf6 GT PUSH22 0x15002900000000000000000000000000000000000000 ", "sourceMap": "25:86:0:-;;;;;;;;;;;;;;;;;" };
    var bytecode = "60606040523415600e57600080fd5b60a480601b6000396000f30060606040523415600e57600080fd5b7f241ba3bafc919fb4308284ce03a8f4867a8ec2f0401445d3cf41a468e7db4ae060405180806020018281038252600e8152602001807f48656c6c6f20657468657265756d00000000000000000000000000000000000081525060200191505060405180910390a10000a165627a7a7230582027a74f4676f1c2335887b2fe50b6c4be31c3297b43cbda42999e9363f61175150029";
    
    var contract_address = "0xc0ffb3862bf5afb62ce780504daf9b946e15148b";
    
    var contract = new this.web3.eth.contract(abi);
    // console.log("contract",contract)
    
    const contractData = contract.new.getData({
      data: '0x' + bytecode
    });
    // console.log("contractdata",contractData)
    const gasLimit = 4302200;
    const gasPrice = 18000;
    const gasPriceHex = this.web3._extend.utils.toHex(gasPrice);
    const gasLimitHex = this.web3._extend.utils.toHex(gasLimit);
    const nonce = 48;
    const nonceHex = this.web3._extend.utils.toHex(nonce);

    //make private key and wallet
    var priv = this.web3.sha3("Hi ng+node");
    var wallet = new ethers.Wallet(priv);
    // console.log(ppkey,wallet)

    //node address
    var nodeaddress = this.web3.eth.accounts[0];
    var getbal = this.web3.eth.getBalance(nodeaddress);
    console.log("fromaddress",nodeaddress,wallet)
    // console.log("amount",this.web3.eth.getBalance(nodeaddress)+" ether")

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
    // console.log("seril",this.web3)
    // this.web3.eth.sign('0x' + serializedTx.toString("hex"))
    // .on('receipt', console.log);
    var status = "ok";
    var resp;

    this.web3.personal.unlockAccount(this.web3.eth.accounts[0], "a", 180);
    let a  = this.web3.eth.sendTransaction({from:this.web3.eth.accounts[0],to:'0x2050a6d43a3da9590d96cbe0008875dda046486e',value:this.web3.toWei(0.5,"ether")});
    console.log("rawtransaction",a)

    this.web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, hash){
        //console.log('contract creation tx1: ' + hash);
      if (err) {
        status = "fail";
        resp = err;
        console.log(err); return;
      }
      // Log the tx, you can explore status manually with eth.getTransaction()
      status = "ok";
      console.log('contract creation tx2: ' + hash);
      const receipt = this.web3.eth.getTransactionReceipt(hash);
      console.log('contract address: ' + receipt.contractAddress);
      resp = receipt.contractAddress;
    });
  }


  sendEther(address,amount){
    return new Promise((resolve,reject)=>{ 
      try{ 
        let send_address = address;
        let amnt = amount;
        console.log(this.web3.eth.accounts)
        console.log(send_address)
        this.web3.personal.unlockAccount(this.web3.eth.accounts[0], "a", 180);
        var dt = {
          from:this.web3.eth.accounts[0], 
          to: send_address, 
          value: this.web3.toHex(this.web3.toWei(amnt))
        };
        console.log(dt)
        var tx = this.web3.eth.sendTransaction(dt);
        if(tx == null || tx == ""){
          tx = null;
          reject({status:"failed"})
        }else{
          tx = tx;
          resolve({status:"ok",tx:tx,data:dt})
        }
      }catch(exception){
        reject({status:"failed",data:exception,message:exception.message})
      }
    })
  }


  

}
