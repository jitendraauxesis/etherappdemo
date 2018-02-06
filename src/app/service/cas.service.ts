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
export class CasService {

  web3;

  constructor(
    public mycryptoService:MycryptoService,
    private http:Http
  ) { 
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
        let url = this.mycryptoService.retrieveFromLocalURL("SISWEB3URL");
        this.web3 = new Web3(new Web3.providers.HttpProvider(url.toString()));
    }
    console.log("this.web3",this.web3);
    // console.log(Buffer)
  }

  init(){
    return this.web3;
  }

  createAddressAndWallet(){
    let checkaddress = this.mycryptoService.retrieveFromLocal("SISUAddress");
    let checkpkey = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");
    if( (checkaddress == null || checkaddress == "" || !checkaddress) &&
        (checkpkey == null || checkpkey == "" || !checkpkey) ){
      // console.log("already made")
          
          let pkey = this.web3.utils.sha3("Generate my private key using this string");
          console.log("Private key",pkey)
          //and wallet address
          let wallet = new ethers.Wallet(pkey);
          // console.log(wallet)
          let address = wallet.address;
          console.log("Wallet address",address)
          this.mycryptoService.saveToLocal("SISUPrivateKey",pkey);
          this.mycryptoService.saveToLocal("SISUAddress",address);
          return "created";
    }else{
      return "already";
    }
  }

  sendEther(address,amount){
    return new Promise((resolve,reject)=>{ 
      try{ 

        this.web3.eth.getAccounts().then(
          dd=>{
            console.log(dd,address)
            let send_address = address;
            let amnt = amount.toString();
            console.log(dd[0],this.web3.eth.accounts)
            console.log(send_address)
            this.web3.eth.personal.unlockAccount(dd[0], "asd", 180);
            var dt = {
              from:dd[0], 
              to: send_address,  
              value: this.web3.utils.toHex(this.web3.utils.toWei(amnt))
            };
            console.log(dt)
            var tx = this.web3.eth.sendTransaction(dt);
            if(tx == null || tx == ""){
              tx = null;
              reject({status:"failed"}) 
            }else{
              tx = tx;
              tx
              .on('transactionHash', (hash)=>{
                resolve({status:"ok",data:dt});
              })
              .on('receipt', (receipt)=>{
                resolve({status:"ok",data:dt});
              })
              .on('confirmation', (confirmationNumber, receipt)=>{ 
                console.log(confirmationNumber,receipt)
               })
              .on('error', console.error);

              resolve(tx)
            } 
          },
          ee=>{
            reject({status:"failed"})
          }
        );


      }catch(exception){
        reject({status:"failed",data:exception,message:exception.message})
      }
    })
  }

  returnCompiledContract(){
    return new Promise((resolve,reject)=>{
      
      this.http.get(this.mycryptoService.retrieveFromLocalURL("SISNODEURL")+"api/web3/contract/compile/erc20")
      .map(res=>res)
      .subscribe(
        
        d=>{
          let dt = JSON.parse(JSON.stringify(d));
          let body = JSON.parse(dt._body);

          var creating_address = this.mycryptoService.retrieveFromLocal("SISUAddress");
          var priv = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");

          
            // this.web3.eth.getAccounts().then(
            //   dd=>{

                  // this.sendEther(creating_address,5.0).then(
                  //   d=>{
                      
                      let acc = "0xe8780B48bdb05F928697A5e8155f672ED91462F7"; 
                      let abi = body.data.interface;
                      let bytecode = body.data.bytecode;
                      // console.log("maincontract",body.data.contract,body);
                      console.log("creating_address",creating_address)
                      var contract = new this.web3.eth.Contract(abi);
        
                      var contractData = contract.deploy({
                        method:'constructor',
                        data:'0x'+bytecode
                      }).encodeABI();

                      let a;
                      
                      // acc = dd[0];
                      // // console.log("addresses:",acc,dd)
                      // a = acc;
                        

                      console.log("contractDAta:",contractData)
                      var gasLimit = 1302200;
                      const gasPrice = 1800000000;
                      const gasPriceHex = this.web3.utils.toHex(gasPrice);
                      const gasLimitHex = this.web3.utils.toHex(gasLimit);
                      const nonce = this.web3.eth.getTransactionCount(creating_address);

                      var nonceHex;
                      nonce.then(
                        d=>{
                          console.log(d)
                          var nonceHex = this.web3.utils.toHex(d);

                          const rawTx = {
                            nonce: nonceHex,
                            gasPrice: gasPriceHex,
                            gasLimit: gasLimitHex,
                            data: contractData,
                            from: creating_address
                          };
    
                          console.log("\n\n\n Rawtx:", rawTx);
    
                          const tx = new Tx(rawTx);
                          // console.log("sadasdsad", tx.serialize().toString('hex'));
                          var pk = priv.toString();
                          pk = pk.substr(2,pk.length);
                          var pk2 = Buffer.Buffer.from(pk,'hex');
                          tx.sign(pk2);
                          const serializedTx = tx.serialize();
                          this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"))
                          .on('receipt', (dd)=>{
                            console.log('receipt',dd)
                            resolve(dd)
                          })
                          .on('error',(ee)=>{
                            console.log('error:',ee)
                            reject(ee)
                          });

                        }
                      )
                     
                      // nonceHex = nonceHex.toString().substr(0,nonceHex.toString().length-18);
                      // console.log("gl", gasLimit, "gp", gasPrice);
                      // console.log("gp:", gasPrice, gasPriceHex, "n:", nonce, nonceHex);
                      

                      // var resp = {
                      //   status:"ok",
                      //   contractData:body
                      // }
                      // resolve(resp)


                  //   },
                  //   e=>{

                  //   }
                  // )
                

            //     },
            //     ee=>{
            //       console.error(ee)
            //       reject(JSON.stringify({status:"fail"}))
            //     }
            // );

              
        },
        e=>reject(e)
      );

    })
  }

  

  // for cas
  getContractAddressForCAS(abi,bytecode){
    // var helloContract = new this.web3.eth.Contract(JSON.stringify(abi));
    // this.web3.personal.unlockAccount(this.web3.eth.accounts[0]);
    console.log(abi,bytecode)
    // helloContract.new(
    //    {
    //      from: this.web3.eth.accounts[0], 
    //      data: bytecode.toString('hex'), 
    //      gas: '4700000'
    //    },  (e, contract)=>{
    //     console.log(e, contract);
    //     if (typeof contract.address !== 'undefined') {
    //          console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    //          return JSON.stringify({
    //            status:'ok',
    //           'contractAddress':contract.address,
    //           'transactionHash:':contract.transactionHash
    //          })
    //     }else{
    //       return JSON.stringify({
    //         status:'fail'
    //       })
    //     }
    // })
  }
}
