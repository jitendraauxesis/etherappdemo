import { Injectable } from '@angular/core';

import { LocalStorageService , SessionStorageService } from 'ngx-webstorage';
import * as CryptJS from 'crypto-js';
import sha256 from 'js-sha512';

@Injectable()
export class MycryptoService {

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
      let key = "This is just a demo"; 
      let val = sha256(key);
      this.localStorageService.store("SISKeystore",val);
    }
  }

  InitKeyGet():String{
    let str = this.localStorageService.retrieve("SISKeystore");
    return str;
  }

  saveToLocal(name,s){
    let key = this.InitKeyGet();
    let str = (CryptJS.AES.encrypt(s,key)).toString();
    this.localStorageService.store(name,str);
  }

  retrieveFromLocal(name):String{
    let key = this.InitKeyGet();
    let fromStore = this.localStorageService.retrieve(name);
    if( fromStore == "" || fromStore == null || fromStore == undefined ){
      return "";
    }else{
      let decrypt = CryptJS.AES.decrypt(fromStore,key);
      let str = decrypt.toString(CryptJS.enc.Utf8);
      return str;
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
