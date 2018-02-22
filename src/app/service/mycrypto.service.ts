import { Injectable } from '@angular/core';

import { LocalStorageService , SessionStorageService } from 'ngx-webstorage';
import * as CryptJS from 'crypto-js';
import sha256 from 'js-sha512';

@Injectable()
export class MycryptoService {

  web3url:any = "http://159.89.14.24:8545";

  constructor(
    private localStorageService:LocalStorageService,
    private sessionStorageService:SessionStorageService
  ) { 
    this.InitKeySet();
  }

  InitKeySet(){
    let chk = this.InitKeyGet();
    if( chk == "" || chk == undefined || chk == null){
      console.log("im in")
      let key = "This is just a demo "+new Date(); 
      let val = sha256(key);
      this.localStorageService.store("SISKeystore",val);

      //global vals
      this.saveToLocalURL("SISNODEURL","http://localhost:3000/");
      this.saveToLocalURL("SISWEB3URL",this.web3url);//"https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");//"http://159.89.14.24:8545");//
      this.saveToLocal("ViewTransactionAddressURL","https://etherscan.io/address/");
      this.saveToLocal("ViewTransactionHashURL","https://etherscan.io/tx/");
    }
    setTimeout(()=>{this.saveInitVars();},500);
  }

  saveInitVars(){
    this.saveToLocalURL("SISNODEURL","http://localhost:3000/");
    this.saveToLocalURL("SISWEB3URL",this.web3url);//"https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");
    this.saveToLocal("ViewTransactionAddressURL","https://etherscan.io/address/");
    this.saveToLocal("ViewTransactionHashURL","https://etherscan.io/tx/");
    console.log("always in ",this.retrieveFromLocalURL("SISWEB3URL"))
  }

  InitKeyGet():String{
    let str = this.localStorageService.retrieve("SISKeystore");
    return str;
  }

  saveToLocal(name,s){
    try{
      let key = this.InitKeyGet();
      let str = (CryptJS.AES.encrypt(s,key)).toString();
      this.localStorageService.store(name,str);
    }catch(e){

    }
  }

  retrieveFromLocal(name):String{
    try{
      let key = this.InitKeyGet();
      let fromStore = this.localStorageService.retrieve(name);
      if( fromStore == "" || fromStore == null || fromStore == undefined ){
        return "";
      }else{
        let decrypt = CryptJS.AES.decrypt(fromStore,key);
        let str = decrypt.toString(CryptJS.enc.Utf8);
        return str;
      }
    }catch(e){
      
    }
  }

  clearStorage():String{
    this.localStorageService.clear();
    let chk = this.InitKeyGet();
    let val;
    if( chk == "" || chk == undefined || chk == null){
      let key = "This is just a demo";
      val = sha256(key);
      this.localStorageService.store("SISKeystore",val);
    }
    return val;
  }

  saveToLocalURL(name,s){
    let key = "This is a url";
    let str = (CryptJS.AES.encrypt(s,key)).toString();
    this.localStorageService.store(name,str);
  }

  retrieveFromLocalURL(name):String{
    let key = "This is a url";
    let fromStore = this.localStorageService.retrieve(name);
    if( fromStore == "" || fromStore == null || fromStore == undefined ){
      return "";
    }else{
      let decrypt = CryptJS.AES.decrypt(fromStore,key);
      let str = decrypt.toString(CryptJS.enc.Utf8);
      return str;
    }
  }
}
