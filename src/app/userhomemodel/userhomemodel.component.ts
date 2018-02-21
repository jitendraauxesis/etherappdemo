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
  selector: 'app-userhomemodel',
  templateUrl: './userhomemodel.component.html',
  styleUrls: ['./userhomemodel.component.css']
})
export class UserhomemodelComponent implements OnInit {
  link: HTMLAnchorElement;

  countTXAddresses:number = 0;
  countTXTokens:number = 0;
  totalTXTokens:any = 0;

  initialView:number = 0;
  isSuccessinitialView:boolean = true;

  isCSVValid:boolean = true;

  fromaddress:any;
  privatekey:any;

  web3:any;

  csvParseDetail:any;
  SISFeeCalc:any;

  disablebtnfor:string = '';
  errormessage:string = '';
  successmessage:string = '';
  public ngxloading  = false;

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
    this.fromaddress = this.mycryptoService.retrieveFromLocal("SISTokenTransferFromAddress");

    let csvFileContent = JSON.parse((this.mycryptoService.retrieveFromLocal("SISFileUploadContent")).toString());
    // console.log(csvFileContent);

    //file is valid
    let filename =csvFileContent.filedata.ufile.filename; 
    let isValid = csvFileContent.filedata.ufile.filetype;
    if( filename.indexOf("csv") > -1 || isValid.indexOf("csv") > -1 || isValid == "text/csv"){
      this.isCSVValid = true;
    }
    else{
      this.isCSVValid = false;
    }

    let details = csvFileContent.csvData;
    let rows = [];
    
    details.forEach((value,key) => {
      // // console.log(value,key)
      this.countTXAddresses =  key+1; 
      this.countTXTokens = key+1;
      rows.push({
        position:(key+1),
        address:value[0],
        tokens:value[1]
      });
      // console.log("row",value[1],this.totalTXTokens,parseInt(value[1]))
      this.totalTXTokens = this.totalTXTokens+parseInt(value[1]);
    });

    let sumOf =  _.sumBy(details,(o)=>{return parseFloat(o[1]);})
    // console.log(sumOf)
    this.totalTXTokens = sumOf;

    this.csvParseDetail = rows;

    // console.log(this.csvParseDetail)

    //fee
    this.SISFeeCalc = JSON.parse((this.mycryptoService.retrieveFromLocal("SISFeeCalc")).toString());
    // console.log(this.SISFeeCalc);

    if(this.SISFeeCalc.individual > this.SISFeeCalc.eth){
      // console.log("here eth")
      this.disablebtnfor = 'lesseth';
      this.errormessage += 'Ether balance is too low. ';
    }
    if(this.totalTXTokens > this.SISFeeCalc.cas ){
      // console.log("here token")
      this.disablebtnfor = 'lesstoken';
      this.errormessage += 'Tokens is more than you are transferring. ';
    } 
    // console.log(
    //   this.totalTXTokens,this.SISFeeCalc.cas,
    //   this.SISFeeCalc.individual, this.SISFeeCalc.eth
    // )

    // this.privatekey = "0xba100b9f412d1283a88fff1c9c7c42c70883c9a8ca1cf17c4496f5e49caa48a0";//"0xbff6ee37dd35f9adc1bb26c0dce1149468cf70f130393f2376c9ef41d0e6fa32";
  }

  next(arg){
    this.initialView = arg;

  }

  validate(){
    this.snackBar.open('CSV Validated','',{
      duration:2000
    });
  }

  callsubmit(){
    
    if(this.privatekey == null || this.privatekey == ""){
      this.snackBar.open('Private Key Is Required','',{
        duration:2000
      });
    }else{
      try{
        let wallet = new ethers.Wallet(this.privatekey);
        // // console.log(wallet)
        let address = wallet.address;
        // console.log(address,this.mycryptoService.retrieveFromLocal("SISTokenTransferFromAddress"),this.fromaddress )
        if(this.fromaddress == address){
          // console.log("sendtokens")
          this.ngxloading  = true;
          this.sendTokens()
          // // console.log(a)
          .then(
            d=>{
              // console.log("PromiseMultiple:",d)
              let dt = JSON.parse(JSON.stringify(d));
              if(dt.status == "infail"){
                this.ngxloading  = false;
                this.snackBar.open('One of token transfer failed','',{
                  duration:2000
                });
                this.appendToRECORDS(this.fromaddress,this.totalTXTokens,dt.data);                
                this.initialView = 2;
                this.isSuccessinitialView = false;
                this.successmessage = "One of token transfer failed";
                this.mycryptoService.saveToLocal("SISDistributedTokenListsCSV",JSON.stringify(dt.data));
                this.activityServ.putActivityInPouch("UserhomemodalComponent","callsubmit()","Unsuccessful transaction","Response:"+JSON.stringify(d));
                // console.log(this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsCSV"))
              }else if(dt.status == "success"){
                this.ngxloading  = false;
                this.snackBar.open('Token transfer success','',{
                  duration:2000
                });
                this.appendToRECORDS(this.fromaddress,this.totalTXTokens,dt.data);
                this.initialView = 2;
                this.isSuccessinitialView = true;
                this.successmessage = 'Total '+this.totalTXTokens+' tokens has been transfer to '+this.countTXAddresses+' addresses';
                this.mycryptoService.saveToLocal("SISDistributedTokenListsCSV",JSON.stringify(dt.data));
                // console.log(this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsCSV"))
                this.activityServ.putActivityInPouch("UserhomemodalComponent","callsubmit()","Successful transaction","Response:"+JSON.stringify(d));
                
              }else{
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
              this.logServ.putErrorInPouch("callsubmit()","CSV Multiple token transfer failed","Token transfer unsuccessful due to error,"+JSON.stringify(e),"1");
        
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
      // this.initialView = 2;
    }
    // this.transferTokens();
  }


  transferTokens(){
    var creating_address = this.mycryptoService.retrieveFromLocal("SISUAddress");
    var priv = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");

    let contractABI =  JSON.parse((this.mycryptoService.retrieveFromLocal("SISContractABI")).toString());
    let contractByteCode = this.mycryptoService.retrieveFromLocal("SISContractByteCode");
    let contractData = this.mycryptoService.retrieveFromLocal("SISContractData");
    let contractAddress = this.mycryptoService.retrieveFromLocal("SISContractAddress");
    

    // // console.log(
    //   contractABI,contractByteCode,contractData,contractAddress,
    //   creating_address,priv,this.csvParseDetail
    // )

    let csvfor = this.csvParseDetail;
    csvfor.forEach((value,key) => {
      // console.log(value,key)
    });

    var gasLimit = 1302200;
    const gasPrice = 1800000000;
    const gasPriceHex = this.web3.utils.toHex(gasPrice);
    const gasLimitHex = this.web3.utils.toHex(gasLimit);
    const nonce = this.web3.eth.getTransactionCount(creating_address);

    var nonceHex;
    
    Promise.all([nonce]).then(
      d=>{
        // // console.log(d)
        var nonceHex = this.web3.utils.toHex(d);
        // // console.log(nonceHex)

        const rawTx = {
          nonce: nonceHex,
          gasPrice: gasPriceHex,
          gasLimit: gasLimitHex,
          data: contractData,
          from: creating_address
        };

        // console.log("\n\n\n Rawtx:", rawTx);
      },
      e=>{
        this.snackBar.open('Unable to find nonce','',{
          duration:2000
        });
      }
    );
  }


  i = 1;
  ngDoCheck(){
    // // console.log("asdf",this.i++);
  }

  sendTokens(){
    // this.ngxloading  = true;
    return new Promise((resolve,reject)=>{
      let ContractABI = this.mycryptoService.retrieveFromLocal("SISContractABI");
      let ContractAddress = this.mycryptoService.retrieveFromLocal("SISContractAddress");
      let ContractData = this.mycryptoService.retrieveFromLocal("SISContractData");
      
      let checkaddress = this.mycryptoService.retrieveFromLocal("SISTokenTransferFromAddress");
      let creating_address = checkaddress;//this.fromaddress;
      let priv = this.privatekey;//this.mycryptoService.retrieveFromLocal("SISUPrivateKey");//

      let csvfor = this.csvParseDetail;

      let appendDATAHASHES = [];

      let value = csvfor;
      let appendValue = csvfor;
      let stringhashes = '';let stringaddresses = '';
      let globalnonce;
      let incr = _.size(csvfor);
      // csvfor.forEach((value,key) => {
      // });
      var contract = new this.web3.eth.Contract(JSON.parse(ContractABI.toString()), ContractAddress);
      const gasPrice = this.web3.eth.getGasPrice();//1800000000;
      // var gasLimit = 1302200;
                                            
      const nonce = this.web3.eth.getTransactionCount(creating_address);
      nonce.then(
        dnonce => {
          globalnonce = dnonce;
          
          // var gasLimit = this.web3.eth.estimateGas({ 
          //   to: creating_address, // data: '0x' + bytecode, 
          //   data: ContractData, // from: wallet.address, 
          // }).then(
          //   valgas =>{ 
              var gasLimit = 1302200;//valgas;
              csvfor.forEach((value,key) => {
                // for(let key=0;key<value.length;key++){
                // // console.log(value,key,value[key],value[key].address,value[key].tokens)
                // // console.log(value,value.address,value.tokens)
                stringaddresses += value.address;  

                

               
                    // // console.log("gasLimit:",valgas)
                    // // console.log(gasLimit)
                    // // console.log("gasPrice:",gasPrice);
                    // const nonce = this.web3.eth.getTransactionCount(creating_address);

                    var nonceHex;
                    Promise.all([gasPrice])
                    .then(
                      (d)=>{
                        // // console.log("gasPricePromise:",d)
                        const gasPriceHex = this.web3.utils.toHex(d[0]);
                        const gasLimitHex = this.web3.utils.toHex(gasLimit);//valgas);
                        // globalnonce = globalnonce++;
                        // console.log(globalnonce)
                        var nonceHex = this.web3.utils.toHex(globalnonce++);
                        // globalnonce = d[1];
                        // // console.log("contract:",contract,"\nCA::",ContractAddress)
                        

                        // contract.methods.balanceOf(creating_address)
                        // .call((err, ress)=>{ 
                        //   // // console.log("ERR:",err, "Response BAL:", ress); 
                        // })
                        var tokens = value.tokens;
                        var firstAdd = value.address;
                        
                        tokens = this.web3.utils.toWei(tokens,'ether');
                        // // console.log(tokens);
                        
                        tokens = tokens.toString('hex');
                        // // console.log(tokens);

                        // tokens = tokens*Math.pow(10,-18);
                        // // console.log(tokens)

                        var hexdata = contract.methods.transfer(firstAdd,tokens)
                        .encodeABI();
                        // // console.log("asdasdas", hexdata);

                        const rawTx = {
                          nonce: nonceHex,
                          gasPrice: gasPriceHex,
                          gasLimit: gasLimitHex,
                          data: hexdata,
                          to: ContractAddress
                        };
                        const tx = new Tx(rawTx);
                        // // console.log("rawTX:", tx.serialize().toString('hex'),rawTx); 
                        var pk = priv.toString();
                        pk = pk.substr(2,pk.length);
                        var pk2 = Buffer.Buffer.from(pk,'hex');
                        tx.sign(pk2);
                        const serializedTx = tx.serialize();
                        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"))
                        .on('transactionHash', (hash)=>{
                            // console.log(hash)
                            // this.successmessage = this.totalTXTokens+' tokens has been transfer to '+this.countTXAddresses;
                            stringhashes += hash+',';
                            let aa = {
                              position:key,
                              // address:value[0],
                              tokens:value.tokens,
                              address:value.address, 
                              hash:hash,
                              response:"Successful token transfer"
                            };
                            appendDATAHASHES.push(aa); 
                            // // console.log("appendDATAHASHES",appendDATAHASHES)
                            // // console.log(incr,key);
                            let akey = key+1;
                            if(incr == akey){
                              // this.ngxloading  = false;
                              // console.log("I append data "+incr+" "+akey,appendDATAHASHES)
                              resolve({status:"success",data:appendDATAHASHES});
                            }
                            // let ddata = this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsCSV");
                            // // console.log(ddata)
                            // if(ddata ==null || ddata == ""){
                            //   this.mycryptoService.saveToLocal("SISDistributedTokenListsCSV",JSON.stringify(aa));
                            // }else{
                            //   ddata = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsCSV")).toString());
                            //   let arr = [];
                            //   ddata.forEach((value,key) => {
                                
                            //   });
                            //   this.mycryptoService.saveToLocal("SISDistributedTokenListsCSV",JSON.stringify(aa));
                            // }
                            
                        })
                        // .on('receipt',(receipt)=>{
                        //   console.log(receipt) 
                        //   stringhashes += receipt.transactionHash+',';
                        //   let aa = {
                        //     position:key,
                        //     // address:value[0],
                        //     tokens:value.tokens,
                        //     address:value.address, 
                        //     hash:receipt.transactionHash,
                        //     response:"Successful token transfer"
                        //   };
                        //   appendDATAHASHES.push(aa); 
                        //   // // console.log("appendDATAHASHES",appendDATAHASHES)
                        //   console.log(incr,key);
                        //   let akey = key+1;
                        //   if(incr == akey){
                        //     // this.ngxloading  = false;
                        //     console.log("I append data "+incr+" "+akey,appendDATAHASHES)
                        //     resolve({status:"success",data:appendDATAHASHES});
                        //   } 
                        // })
                        .on('error',(ee)=>{
                          // this.ngxloading  = false;
                          // // console.log('error:',ee,JSON.stringify(ee))

                          if(ee){
                            stringhashes += null+',';
                            let aa = {
                              position:key,
                              // address:value[0],
                              tokens:value.tokens,
                              address:value.address,
                              hash:null,
                              message:'Token transfer failed',
                              response:ee.message
                            };
                            appendDATAHASHES.push(aa); 
                            resolve({status:"infail",data:appendDATAHASHES});
                          }
                          // reject({status:"fail",message:ee});
                        }); 
                      }
                    )
                
              });
          //   }
          // );
          // console.log("appendDATAHASHES",appendDATAHASHES) 
        }
      )
      
      // return appendDATAHASHES;
      // if(appendDATAHASHES == null){
      //   this.appendToRECORDS(stringhashes,stringaddresses,creating_address,this.totalTXTokens,appendDATAHASHES);
      //   // resolve({status:"success",data:appendDATAHASHES});
      //   // console.info("asdf",{status:"success",data:appendDATAHASHES})
      // }else{
      //   // reject({status:"fail",message:"Hash not generated"});
      //   // console.error({status:"fail",message:"Hash not generated"})
      // }
      // appendDATAHASHES.forEach((value,key)=>{
      //   if(value.hash == null || value.hash == ""){
      //     reject({status:"fail",message:ee})
      //   }
      // })
    })
  }

  appendToRECORDS(creating_address,tt,appendDATAHASHES){
    // strhash = strhash.slice(0, -1);
    // straddr = straddr.slice(0, -1);

    // for()

    // // console.log(strhash,"\n",straddr,"\n",creating_address,tt)
    let ddata = this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists");
    // console.log(ddata)
    if(ddata == null || ddata == ""){
      // console.log("no receipts")
      this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify([{
        id:1,
        fromaddress:creating_address,
        // toaddress:straddr,
        tokens:tt,
        // transactionHash:strhash,
        distributed:'multiple',
        timestamp:new Date(),
        csvData:appendDATAHASHES
      }])); 
    }else{
      ddata = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
      
      // this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify(p))
      // // console.log("topush",this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists"))
      // let dth = hash;
      // let find = _.find(ddata, function(o) { if(o.transactionHash == dth){ return o; } });
      // if(find == dth){
      //   // console.log("donothing")
      // }else{
        let max = _.maxBy(ddata, function(o) { return o.id; });
        // console.log(max,max.id)
        let maxid = max.id+1;
        let distribute = {
          id:maxid,
          fromaddress:creating_address,
          // toaddress:straddr,
          tokens:tt,
          // transactionHash:strhash,
          distributed:'multiple',
          timestamp:new Date(),
          csvData:appendDATAHASHES
        };
        // let p = {"id":maxid,"fromaddress":"0xcD0f4B8aC1079E894394448880B90e23d1a7C72e","toaddress":"0x0B4E82f84CcC40Dd5920602ef01E75692032195f","tokens":"34","transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","timestamp":"2018-02-08T10:42:54.929Z","receiptdetail":{"blockHash":"0xa33cda3d793e9f56a93f2d20fcbff5b15db10a79369051278236d91d989f4655","blockNumber":2612732,"contractAddress":null,"cumulativeGasUsed":86900,"from":"0xcd0f4b8ac1079e894394448880b90e23d1a7c72e","gasUsed":37075,"logs":[{"address":"0x11Dc5a650E1e2a32C336Fa73439e7CC035976c06","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000cd0f4b8ac1079e894394448880b90e23d1a7c72e","0x0000000000000000000000000b4e82f84ccc40dd5920602ef01e75692032195f"],"data":"0x000000000000000000000000000000000000000000000001d7d843dc3b480000","blockNumber":2612732,"transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","transactionIndex":2,"blockHash":"0xa33cda3d793e9f56a93f2d20fcbff5b15db10a79369051278236d91d989f4655","logIndex":0,"removed":false,"id":"log_321b1310"}],"logsBloom":"0x00000000000000000000000000000000004000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000010000000000000000000000000000040020000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000001000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000","status":"0x1","to":"0x11dc5a650e1e2a32c336fa73439e7cc035976c06","transactionHash":"0xa15a226354b4303d22b00afdf5cbfa98e982f1cacedc51e124816454ac3bb97f","transactionIndex":2}};
        let arr = [];
        let pp = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists").toString()));
        // // console.log(pp)
        pp.forEach((value,key) => {
          // // console.log(value,key)
          arr.push(value)
        });
        arr.push(distribute);
        // console.log(arr)
        this.mycryptoService.saveToLocal("SISDistributedTokenLists",JSON.stringify(arr))
        let dd1 = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
        // console.log(dd1)
      // }
    }

    // this.snackBar.open(tt+' Tokens sent.','',{
    //   duration:2000
    // });
    // this.initialView = 2;
    // this.ngxloading  = false;
  }


  fileEXPORTDATA:string = "";
  fileEXPORTDATABASE:any;
  fileEXPORTJSONDATA:any = [];
  fileEXPORTJSONDATABASE:any;
  download(type){
    let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsCSV")).toString());
    if(type == "csv"){
      // console.log("type",type,data)
      data.forEach((value,key) => {
        let resp = value.response?value.response:"Succeessful token transfer";
        // // console.log(value.address+","+value.tokens+","+value.hash+","+resp+"\n")
        this.fileEXPORTDATA =this.fileEXPORTDATA + value.address+","+value.tokens+","+value.hash+","+resp+"\n";
        // // console.log(this.ddumdata)
      });
      // console.log(this.fileEXPORTDATA)
      // console.log(btoa(this.fileEXPORTDATA))
      this.fileEXPORTDATABASE = btoa(this.fileEXPORTDATA);
      let val =  "data:text/csv;base64,"+this.fileEXPORTDATABASE;
      let filename = moment().unix()+"-"+this.totalTXTokens+"-CAS-Token-Distribution";
      this.downloadURI(val, filename+".csv");
    }else if(type == "json"){
      // console.log("type",type,data)
      data.forEach((value,key) => {
        let resp = value.response?value.response:"Succeessful token transfer";
        // console.log(value.address+","+value.tokens+","+value.hash+","+resp+"\n")
        this.fileEXPORTJSONDATA.push({
          toAddress:value.address,
          transactionHash:value.hash,
          tokens:value.tokens,
          notes:resp
        })
        // // console.log(this.ddumdata)
      });
      // console.log(this.fileEXPORTJSONDATA)
      // console.log(btoa(JSON.stringify(this.fileEXPORTJSONDATA)))
      this.fileEXPORTJSONDATABASE = btoa(JSON.stringify(this.fileEXPORTJSONDATA));
      let val =  "data:application/json;base64,"+this.fileEXPORTJSONDATABASE;
      let filename = moment().unix()+"-"+this.totalTXTokens+"-CAS-Token-Distribution";
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
