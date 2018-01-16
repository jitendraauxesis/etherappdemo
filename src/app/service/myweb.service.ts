import { Injectable } from '@angular/core';

import * as Web3 from 'web3';
import *  as ethers from 'ethers';
import * as Tx from 'ethereumjs-tx';
import * as solc from 'solc';

var web3;

import { MycryptoService } from './mycrypto.service';

@Injectable()
export class MywebService {

  constructor(
    public mycryptoService:MycryptoService
  ) { 
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8008"));
    }
    console.log(web3);
  }

  createAddressAndWallet(){
    var ppkey = web3.sha3("Hi ethereumjs-tx-1");
    var wallet = new ethers.Wallet(ppkey);
    wallet = wallet.address;
    // console.log(ppkey,wallet)

    this.mycryptoService.saveToLocal("SISDumPrivateKey",ppkey);
    this.mycryptoService.saveToLocal("SISDumWalletAddress",wallet);
    

    var nodeaddress = web3.eth.accounts[0];
    // console.log(nodeaddress)
    // console.log("amount",web3.eth.getBalance(nodeaddress)+" ether")
    this.mycryptoService.saveToLocal("SISDumNodeAddress",nodeaddress);
  }

  deployContract(){
    console.log(solc)
  }

}
