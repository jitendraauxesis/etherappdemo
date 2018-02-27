import { Component, OnInit } from '@angular/core';
import { CasService } from '../service/cas.service';
import { MatSnackBar } from '@angular/material';
import { MycryptoService } from '../service/mycrypto.service';
import *  as ethers from 'ethers';
import * as Tx from 'ethereumjs-tx';
import * as solc from 'solc';
import * as Buffer from 'buffer';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PouchactivityService } from '../service/pouchactivity.service';
import { PouchlogsService } from '../service/pouchlogs.service';
@Component({
  selector: 'app-userhomesinglemodel',
  templateUrl: './userhomesinglemodel.component.html',
  styleUrls: ['./userhomesinglemodel.component.css']
})
export class UserhomesinglemodelComponent implements OnInit {
  link: HTMLAnchorElement;

  initialView:number = 0;
  isSuccessinitialView:boolean = true;


  fromaddress:any;
  privatekey:any;

  web3:any;

  SISFeeCalc:any;
  toaddress:any;
  tokenstosend:any;
  public ngxloading  = false;

  disablebtnfor:string = '';
  errormessage:string = '';
  successmessage:string = '';

  viewAddress:any = 'https://etherscan.io/address/';//'https://ropsten.etherscan.io/address/';
  viewHash:any = 'https://etherscan.io/tx/';

  constructor(
    public casService:CasService,
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public activityServ:PouchactivityService,
    public logServ:PouchlogsService
  ) { 
    this.web3 = this.casService.init();
  }

  ngOnInit() {

    this.viewAddress = this.mycryptoService.retrieveFromLocal("ViewTransactionAddressURL");
    this.viewHash = this.mycryptoService.retrieveFromLocal("ViewTransactionHashURL");

    //fee
    this.SISFeeCalc = JSON.parse((this.mycryptoService.retrieveFromLocal("SISFeeCalc")).toString());
    // console.log(this.SISFeeCalc);
    


    //to address
    this.toaddress = this.mycryptoService.retrieveFromLocal("SISTokenTransferToAddress");

    //tokens to
    this.tokenstosend = this.mycryptoService.retrieveFromLocal("SISTokenTransferTokens");

    //from address
    this.fromaddress =  this.mycryptoService.retrieveFromLocal("SISTokenTransferFromAddress");
    
    if( parseFloat((this.SISFeeCalc.individual).toString()) > parseFloat((this.SISFeeCalc.eth).toString())){
      // console.log("here eth")
      this.disablebtnfor = 'lesseth';
      this.errormessage += 'Ether balance is too low. ';
    }//else{console.log("im valid eth")}
    // if(this.tokenstosend > this.SISFeeCalc.cas ){
    if(parseFloat((this.tokenstosend).toString()) > parseFloat((this.SISFeeCalc.cas).toString()) ){
      // console.log("here token")
      this.disablebtnfor = 'lesstoken';
      this.errormessage += 'Tokens is more than you are transferring. ';
    }//else{console.log("im valid token")}
    // console.log(
    //   this.tokenstosend,this.SISFeeCalc.cas,
    //   this.SISFeeCalc.individual, this.SISFeeCalc.eth,this.SISFeeCalc
    // )

    // if(2>10){
    //   // console.log("less token")
    // }else{// console.log("grt token")}
    // if(0.002154336>0){
    //   // console.log("less/more eth")
    // }else{// console.log("grt token")}
  }

  showmsg(msg){
    if(msg == "lesstoken"){
      this.snackBar.open('Tokens are more than you are sending','',{
        duration:3000
      });
    }else if(msg == "lesseth"){
      this.snackBar.open('Ether balance is lesser','',{
        duration:3000
      });
    }else{
      this.snackBar.open('Token could not be transaction right now.','',{
        duration:3000
      });
    }
  }

  next(arg){
    this.initialView = arg;
  }

  callsubmit(){
    // if(this.fromaddress == null || this.fromaddress == ""){
    //   this.snackBar.open('From Address Is Required','',{
    //     duration:2000
    //   });
    // }else 
    if(this.privatekey == null || this.privatekey == ""){
      this.snackBar.open('Private Key Is Required','',{
        duration:2000
      });
    }
    else{
      // this.initialView = 2;
      //verifying address and private key
      try{
        let wallet = new ethers.Wallet(this.privatekey);
        // // console.log(wallet)
        let address = wallet.address;
        // console.log(address,this.mycryptoService.retrieveFromLocal("SISTokenTransferFromAddress"),this.fromaddress )
        if(this.fromaddress == address){
          this.ngxloading  = true;
          this.sendTokens()
          .then(
            d=>{
              // console.log("PromiseMultiple:",d)
              let dt = JSON.parse(JSON.stringify(d));
              if(dt.status == "infail"){
                this.snackBar.open(dt.message,'',{
                  duration:2000
                });
                this.isSuccessinitialView = false;
                this.successmessage = dt.message;
                this.initialView = 2;
                this.ngxloading  = false;
                this.activityServ.putActivityInPouch("UserhomesinglemodalComponent","callsubmit()","Successful transaction","Response:"+JSON.stringify(d));
                
              }else if(dt.status == "success"){
                this.snackBar.open(dt.message,'',{
                  duration:2000
                });
                this.isSuccessinitialView = true;
                this.initialView = 2;
                this.ngxloading  = false;
                this.activityServ.putActivityInPouch("UserhomesinglemodalComponent","callsubmit()","Successful transaction","Response:"+JSON.stringify(d));
                
              }
              else{
                this.ngxloading  = false;
                this.snackBar.open('Token transfer failed','',{
                  duration:2000
                });
              }
            },
            e=>{
              this.ngxloading  = false;
              // console.log(e)
              this.snackBar.open('Token transfer failed','',{
                duration:2000
              });
              this.logServ.putErrorInPouch("callsubmit()","Single token transfer failed","Token transfer unsuccessful due to error,"+JSON.stringify(e),"1");
        
            }
          );
        }else{
          this.snackBar.open('Private Key Is Invalid','',{
            duration:2000
          });
        }
      }catch(e){
        this.logServ.putErrorInPouch("callsubmit()","Invalid private key enter","For multiple token transfer","3");
        
        this.snackBar.open('Private Key Is Invalid','',{
          duration:2000
        });
      }
    }
  }

  sendTokens(){
    return new Promise((resolve,reject)=>{
      
    let ContractABI = this.mycryptoService.retrieveFromLocal("SISContractABI");
    let ContractByteCode = this.mycryptoService.retrieveFromLocal("SISContractByteCode");
    let ContractData = this.mycryptoService.retrieveFromLocal("SISContractData");
    let ContractAddress = this.mycryptoService.retrieveFromLocal("SISContractAddress");

    let firstAdd = this.toaddress;
    let tokens = this.tokenstosend;

    // let checkaddress = this.mycryptoService.retrieveFromLocal("SISUAddress");
    // let checkpkey = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");

    let checkaddress = this.mycryptoService.retrieveFromLocal("SISTokenTransferFromAddress");
    let checkpkey = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");//this.privatekey;

    // // console.log("addrkey:",checkaddress,"\n",checkpkey,"\n",firstAdd,"privkey:\n",this.privatekey) 

    // console.log(checkaddress)
    let creating_address = checkaddress;//this.fromaddress;
    let priv = this.privatekey;
    
    var contract = new this.web3.eth.Contract(JSON.parse(ContractABI.toString()), ContractAddress);
            // console.log("contract:",contract,"\nCA::",ContractAddress)
    var tt = tokens;
    
    tokens = this.web3.utils.toWei(tokens,'ether');
    // console.log(tokens);
    
    tokens = tokens.toString('hex');
    var hexdata = contract.methods.transfer(firstAdd,tokens)
            .encodeABI();
            // console.log("asdasdas", hexdata);

    // var gasLimit = this.web3.eth.estimateGas({ 
    //   to: creating_address, // data: '0x' + bytecode, 
    //   data: hexdata, // from: wallet.address, 
    // }).then(
    //   valgas =>{  
        // // console.log("gasLimit:",valgas)
        // // console.log(gasLimit)
        var gasLimit = 1302200;//valgas;//
        const gasPrice = this.web3.eth.getGasPrice();//1800000000;
        // // console.log("gasPrice:",gasPrice);
        const nonce = this.web3.eth.getTransactionCount(creating_address);

        var nonceHex;
        Promise.all([gasPrice,nonce])
        .then(
          (d)=>{
            // console.log("gasPricePromise:",d)
            const gasPriceHex = this.web3.utils.toHex(d[0]);
            const gasLimitHex = this.web3.utils.toHex(gasLimit);//valgas);
            var nonceHex = this.web3.utils.toHex(d[1]);
            
            

            contract.methods.balanceOf(creating_address)
            .call((err, ress)=>{ 
              // console.log("ERR:",err, "Response BAL:", ress); 
            })
            
            // console.log(tokens);

            // tokens = tokens*Math.pow(10,-18);
            // // console.log(tokens)

            

            
            const rawTx = {
              nonce: nonceHex,
              gasPrice: gasPriceHex,
              gasLimit: gasLimitHex,
              data: hexdata,
              to: ContractAddress
            };
            const tx = new Tx(rawTx);
            // console.log("rawTX:", tx.serialize().toString('hex'),rawTx);
            var pk = priv.toString();
            pk = pk.substr(2,pk.length);
            var pk2 = Buffer.Buffer.from(pk,'hex');
            tx.sign(pk2);
            const serializedTx = tx.serialize();
            this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"))
            .on('transactionHash', (hash)=>{
                // console.log(hash)
                this.successmessage = tt+' tokens has been transfer to '+'<a class="alink" href="'+this.viewAddress+firstAdd+'" target="_blank">'+firstAdd+'</a> with transaction hash <a class="alink" href="'+this.viewHash+hash+'" target="_blank">'+hash+'</a>. Token confirmations may took time wait until confirmations is done by blockchain.';
              
                let ddata = this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists");
                // console.log(ddata)
                if(ddata == null || ddata == ""){
                  // console.log("no receipts")
                  this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify([{
                    id:1,
                    fromaddress:creating_address,
                    toaddress:firstAdd,
                    tokens:tt,
                    transactionHash:hash,
                    distributed:'single',
                    timestamp:new Date()
                  }])); 
                }else{
                  ddata = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
                  // console.log(ddata,this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists"))
                  // this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify(p))
                  // // console.log("topush",this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists"))
                  let dth = hash;
                  let find = _.find(ddata, function(o) { if(o.transactionHash == dth){ return o; } });
                  if(find == dth){
                    // console.log("donothing")
                  }else{
                    let max = _.maxBy(ddata, function(o) { return o.id; });
                    // console.log(max,max.id)
                    let maxid = max.id+1;
                    let distribute = {
                      id:maxid,
                      fromaddress:creating_address,
                      toaddress:firstAdd,
                      tokens:tt,
                      transactionHash:hash,
                      distributed:'single',
                      timestamp:new Date()
                    };
                    // let p = {"id":maxid,"fromaddress":"0xcD0f4B8aC1079E894394448880B90e23d1a7C72e","toaddress":"0x0B4E82f84CcC40Dd5920602ef01E75692032195f","tokens":"34","transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","timestamp":"2018-02-08T10:42:54.929Z","receiptdetail":{"blockHash":"0xa33cda3d793e9f56a93f2d20fcbff5b15db10a79369051278236d91d989f4655","blockNumber":2612732,"contractAddress":null,"cumulativeGasUsed":86900,"from":"0xcd0f4b8ac1079e894394448880b90e23d1a7c72e","gasUsed":37075,"logs":[{"address":"0x11Dc5a650E1e2a32C336Fa73439e7CC035976c06","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000cd0f4b8ac1079e894394448880b90e23d1a7c72e","0x0000000000000000000000000b4e82f84ccc40dd5920602ef01e75692032195f"],"data":"0x000000000000000000000000000000000000000000000001d7d843dc3b480000","blockNumber":2612732,"transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","transactionIndex":2,"blockHash":"0xa33cda3d793e9f56a93f2d20fcbff5b15db10a79369051278236d91d989f4655","logIndex":0,"removed":false,"id":"log_321b1310"}],"logsBloom":"0x00000000000000000000000000000000004000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000010000000000000000000000000000040020000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000001000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000","status":"0x1","to":"0x11dc5a650e1e2a32c336fa73439e7cc035976c06","transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","transactionIndex":2}};
                    let arr = [];
                    // arr.push(ddata);
                    let pp = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists").toString()));
                    // // console.log(pp)
                    pp.forEach((value,key) => {
                      // // console.log(value,key)
                      arr.push(value)
                    });
                    arr.push(distribute);
                    // // console.log(arr)
                    this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify(arr))
                    let dd1 = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
                    // console.log(dd1)
                  }
                }
                this.mycryptoService.saveToLocal("SISDistributedTokenListsJSON",JSON.stringify({
                  toAddress:firstAdd,
                  tokens:tt,
                  transactionHash:hash,
                  notes:'Successful token transfer'
                }))
                resolve({status:"success",message:tt+' Tokens sent.'})
                
            })
            // .on('receipt', (dd)=>{
            //   // console.log('receipt',dd)
            //   // this.successmessage = tt+' tokens has been transfer to '+firstAdd+' with '+dd.transactionHash+'.';
            //   // this.mycryptoService.saveToLocal("SISContractBlockHash",dd.blockHash);
            //   // this.mycryptoService.saveToLocal("SISContractAddress",dd.contractAddress);
            //   // this.mycryptoService.saveToLocal("SISContractTxHash",dd.transactionHash);
            //   // this.mycryptoService.saveToLocal("SISContractReceiptDetail",JSON.stringify(dd));
              
            //   // console.log(dd)

              

            //   // this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify({
            //   //   id:1,
            //   //   fromaddress:creating_address,
            //   //   toaddress:firstAdd,
            //   //   tokens:tt,
            //   //   transactionHash:dd.transactionHash,
            //   //   distributed:'single',
            //   //   timestamp:new Date(),
            //   //   receiptdetail:dd
            //   // }));

              

            //   // contract.methods.balanceOf(creating_address)
            //   // .call((err, ress)=>{ 
            //   //   // console.log("ERR:",err, "Balance:", ress); 
            //   // })

              
            // })
            .on('error',(ee)=>{
              // this.ngxloading  = false;
              // console.log('error:',ee)
              let ddata = this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists");
                // console.log(ddata)
                if(ddata == null || ddata == ""){
                  // console.log("no receipts")
                  this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify([{
                    id:1,
                    fromaddress:creating_address,
                    toaddress:firstAdd,
                    tokens:tt,
                    transactionHash:null,
                    distributed:'single',
                    timestamp:new Date(),
                    message:ee.message
                  }])); 
                }else{
                  ddata = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
                  
                  // this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify(p))
                  // // console.log("topush",this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists"))
                  let dth = null;
                  let find = _.find(ddata, function(o) { if(o.transactionHash == dth){ return o; } });
                  if(find == dth){
                    // console.log("donothing")
                  }else{
                    let max = _.maxBy(ddata, function(o) { return o.id; });
                    // console.log(max,max.id)
                    let maxid = max.id+1;
                    let distribute = {
                      id:maxid,
                      fromaddress:creating_address,
                      toaddress:firstAdd,
                      tokens:tt,
                      transactionHash:null,
                      distributed:'single',
                      timestamp:new Date(),
                      message:ee.message
                    };
                    // let p = {"id":maxid,"fromaddress":"0xcD0f4B8aC1079E894394448880B90e23d1a7C72e","toaddress":"0x0B4E82f84CcC40Dd5920602ef01E75692032195f","tokens":"34","transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","timestamp":"2018-02-08T10:42:54.929Z","receiptdetail":{"blockHash":"0xa33cda3d793e9f56a93f2d20fcbff5b15db10a79369051278236d91d989f4655","blockNumber":2612732,"contractAddress":null,"cumulativeGasUsed":86900,"from":"0xcd0f4b8ac1079e894394448880b90e23d1a7c72e","gasUsed":37075,"logs":[{"address":"0x11Dc5a650E1e2a32C336Fa73439e7CC035976c06","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000cd0f4b8ac1079e894394448880b90e23d1a7c72e","0x0000000000000000000000000b4e82f84ccc40dd5920602ef01e75692032195f"],"data":"0x000000000000000000000000000000000000000000000001d7d843dc3b480000","blockNumber":2612732,"transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","transactionIndex":2,"blockHash":"0xa33cda3d793e9f56a93f2d20fcbff5b15db10a79369051278236d91d989f4655","logIndex":0,"removed":false,"id":"log_321b1310"}],"logsBloom":"0x00000000000000000000000000000000004000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000010000000000000000000000000000040020000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000001000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000","status":"0x1","to":"0x11dc5a650e1e2a32c336fa73439e7cc035976c06","transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","transactionIndex":2}};
                    let arr = [];
                    // arr = ddata;
                    arr.push(distribute);
                    // // console.log(arr)
                    this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify(arr))
                    let dd1 = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
                    // console.log(dd1)
                  }
                }
                this.mycryptoService.saveToLocal("SISDistributedTokenListsJSON",JSON.stringify({
                  toAddress:firstAdd,
                  tokens:tt,
                  transactionHash:null,
                  notes:'Token transfer failed due to '+ee.message
                }))
                resolve({status:"infail",message:'Token transfer failed due to '+ee.message});
              // this.snackBar.open('Token transfer failed','',{
              //   duration:2000
              // });
            }); 
            
          }
        )
    //   }
    // );

    
    })
  }

  fileEXPORTDATA:string = "";
  fileEXPORTDATABASE:any;
  fileEXPORTJSONDATA:any = [];
  fileEXPORTJSONDATABASE:any;
  download(type){
    let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsJSON")).toString());
    if(type == "csv"){
      // console.log("type",type,data)
      let resp = data.response?data.response:"Succeessful token transfer";

      this.fileEXPORTDATA = data.toAddress+","+data.tokens+","+data.transactionHash+","+resp;
      // console.log(this.fileEXPORTDATA)
      // console.log(btoa(this.fileEXPORTDATA))

      this.fileEXPORTDATABASE = btoa(this.fileEXPORTDATA);
      let val =  "data:text/csv;base64,"+this.fileEXPORTDATABASE;
      let filename = moment().unix()+"-"+this.tokenstosend+"-CAS-Token-Distribution";
      this.downloadURI(val, filename+".csv");
    }else if(type == "json"){
      // console.log("type",type,data)

      this.fileEXPORTJSONDATA = data;

      // console.log(this.fileEXPORTJSONDATA)
      // console.log(btoa(JSON.stringify(this.fileEXPORTJSONDATA)))
      this.fileEXPORTJSONDATABASE = btoa(JSON.stringify(this.fileEXPORTJSONDATA));
      let val =  "data:application/json;base64,"+this.fileEXPORTJSONDATABASE;
      let filename = moment().unix()+"-"+this.tokenstosend+"-CAS-Token-Distribution";
      this.downloadURI(val, filename+".json");
      // this.downloadURI(val.value, filename+".csv");
    }
  }
  
  downloadURI(uri, name) {
      
    this.link = document.createElement("a");
    this.link.download = name;
    this.link.href = uri;
    document.body.appendChild(this.link);
    this.link.click();
    document.body.removeChild(this.link);
    delete this.link;
  }


}