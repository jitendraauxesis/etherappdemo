import { Component, OnInit } from '@angular/core';

import { FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MycryptoService } from '../service/mycrypto.service';
import { CasService } from '../service/cas.service';
import {MatDialog} from '@angular/material';
import { UserhomemodelComponent } from '../userhomemodel/userhomemodel.component';
import { FileUtilService } from '../interfaces/file-util.service';
import { ConstantsService } from '../interfaces/constants.service';
import { UserhomesinglemodelComponent } from '../userhomesinglemodel/userhomesinglemodel.component';
import *  as ethers from 'ethers';
import * as Tx from 'ethereumjs-tx';
import * as solc from 'solc';
import * as Buffer from 'buffer';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PouchactivityService } from '../service/pouchactivity.service';
import { PouchlogsService } from '../service/pouchlogs.service';
@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent implements OnInit {

  uploadForm:FormGroup;

  @ViewChild('csvfile') csvfile:ElementRef;

  fileContent:any;

  csvRecords = [];
  public ngxloading  = false;

  isSelect = 1;

  recordTOSendMsg1:any = "";
  recordTOSendMsg2:any = "";

  constructor(
    public formbuilder:FormBuilder,
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    private _fileUtil: FileUtilService,
    public activityServ:PouchactivityService,
    public logServ:PouchlogsService
  ) {  
    this.uploadForm = formbuilder.group({
      ufile:['',[Validators.compose([Validators.required])]],
      address:['',[Validators.compose([Validators.required])]]
    }); 
  } 

  ddumdata:any;
  ngOnInit() {
    this.contractDetails();
    this.saveNewDetail();

    let status = this.casService.createAddressAndWallet();
    if(status == "already"){
      // // console.log(status) 
      // this.sendMoney();
    }else{
      // this.sendMoney();
    }

    setTimeout(()=>{
      // this.openModal();
    },1000)
    

    // let ContractAddress = this.mycryptoService.retrieveFromLocal("SISContractAddress");
    // // console.log(ContractAddress,"ca");

    // let ddata = (this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString();
    // // console.log(ddata)  
    // let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenListsJSON")).toString());
    // console.log(data)  


    // // data.forEach((value,key) => {
    //   let resp = data.notes?data.notes:"Succeessful token transfer";
    //   // console.log(data.toAddress+","+data.tokens+","+data.transactionHash+","+resp+"\n")
    //   // this.ddumdata.push({
    //   //   toAddress:value.address,
    //   //   transactionHash:value.hash,
    //   //   tokens:value.tokens,
    //   //   notes:resp
    //   // })
    //   // // console.log(this.ddumdata)
    // // });
    // this.ddumdata = data;
    // // console.log(this.ddumdata)
    // // console.log(btoa(JSON.stringify(this.ddumdata)))
    
  }

  panelbtn(arg){
    this.isSelect = arg;
    if(arg == 1 ){
      // this.csvfile.nativeElement.value = "";
    }else if(arg == 2){
      this.singleaddress = "";
      this.singlefromaddress = "";
      this.singletokens = "";
    }
  }

  sendMoney(){
    let address = this.mycryptoService.retrieveFromLocal("SISUAddress");
    let checkpkey = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");
    // // console.log(address,checkpkey,this.casService.init())
    let web3 = this.casService.init();
    web3.eth.getAccounts().then(
      dd=>{
        // // console.log(dd,address)
        let send_address = address;
        let amnt = "5";
        web3.eth.personal.unlockAccount(dd[0], "asd", 180) 
        .then(
          d=>{
            // // console.log(d)
            var dt = {
              from:dd[0], 
              to: send_address,  
              value: web3.utils.toHex(web3.utils.toWei(amnt))
            };
            // // console.log(dt)
            web3.eth.sendTransaction(dt,(error,hash)=>{
              // // console.log(error,hash)
              if(error){
                // console.log("send ether failed due to:",error)
              }else{
                // console.log("hash,",hash)
              }
            });
          },
          e=>{
            // console.log(e)
          }
        );
        
      },
      ee=>{
        // console.log("failed last")
      }
    );
  }

  onFileChange(event) {
    // console.log(event)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      // // console.log(file,event)
      if(file.size > 2000000){
        // this.failmsg("File size can not be greater than 1 Mb");
        this.uploadForm.get('ufile').setValue(null);
        this.csvfile.nativeElement.value = "";
        return false;
      }else{
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.fileContent = reader.result;
          // console.log(file,this.uploadForm,JSON.stringify({data:reader.result}))
          this.uploadForm.get('ufile').setValue({
            filename: file.name,
            filetype: file.type,
            filesize: file.size,
            value: reader.result.split(',')[1]
          }) 
        };
      }
    }
  }

  fileChangeListener(event): void {
    // console.log("event",event);
    try{
      var text = [];
      var files = event.target.files;
  
      if(ConstantsService.validateHeaderAndRecordLengthFlag){
        if(!this._fileUtil.isCSVFile(files[0])){
          // alert("Please import valid .csv file.");
          this.snackBar.open("Please import valid .csv file.",'Undo',{
            duration:2000
          });
          this.fileReset();
        }  
      }
  
      var input = event.target;
      var file = input.files[0];
      var reader = new FileReader();
      reader.readAsText(input.files[0]);
  
      reader.onload = (data) => {
        let csvData = reader.result;
        // console.log("csvData,",csvData,reader,data)
        this.fileContent = csvData;
        let csvRecordsArray = csvData.split(/\r\n|\n/);///\r\n|\n/
  
        csvRecordsArray = _.filter(csvRecordsArray,function(o){return o!="";});
        
        var headerLength = -1;
        if(ConstantsService.isHeaderPresentFlag){
          let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, ConstantsService.tokenDelimeter);
          headerLength = headersRow.length; 
        }
        
        this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
            headerLength, ConstantsService.validateHeaderAndRecordLengthFlag, ConstantsService.tokenDelimeter);
        
        // console.log(_.size(this.csvRecords)) 
        
        // not available
        if(this.csvRecords == null){
          //If control reached here it means csv file contains error, reset file.
          this.fileReset();
        }
        else{
          let size = _.size(this.csvRecords)
          if(size > 200){
            this.snackBar.open('CSV file limit exceed. 200 addresses can be allowed for csv file.','',{
              duration:4000
            });
            this.fileReset();
          }else{
            //file content available    
            // // console.log("this.csvRecords",this.csvRecords)
            this.uploadForm.get('ufile').setValue({
              filename: file.name,
              filetype: file.type,
              filesize: file.size,
              value: reader.result,
              lastmodified:file.lastModified,
              lastmodifieddate:file.lastModifiedDate
            }) 
            // // console.log("ok")
          }
        }    
      }
  
      reader.onerror = () => {
        // alert('Unable to read ' + input.files[0]);
        this.snackBar.open('Unable to read ' + input.files[0],'Undo',{
          duration:2000
        });
      };
    }catch(e){
      // console.log("error",e)
      this.logServ.putErrorInPouch("fileChangeListener()","File upload error caught","Some issue with uploaded file,"+JSON.stringify(e),"1");
    }

  };
 
  fileReset(){
    this.csvfile.nativeElement.value = "";
    this.csvRecords = [];
  }
 
  haveFileError(csv,web3){//should return 0
    let error = 0;
    // csv.forEach((value,key) => {
    let value = csv;
    for(let key=0;key<value.length;key++){  
        // // console.log(value[key][0],value.length)
        // console.log(web3.utils.isAddress(value[key][0]),value[key][1])
        if(web3.utils.isAddress(value[key][0]) && (value[key][1]!=0||value[key][1]!="0")){
          // console.log(web3.utils.isAddress(value[key][0]),value[key][0],value[key][1],key)
          error = 0;
        }else{
          // console.log(web3.utils.isAddress(value[key][0]),value[key][0],value[key][1],key)
          if(web3.utils.isAddress(value[key][0]) == false){
            this.recordTOSendMsg1 = "Address "+value[key][0]+" is invalid. ";
          }
          if((value[key][1]==0||value[key][1]=="0")){
            this.recordTOSendMsg2 = "Token value "+value[key][1]+" not acceptable.";
          }
          // console.log("error")
          error = 1;
          break;
          // return false;
        }
    };
    return error;
  }

  uploadcsv(){
    if(this.uploadForm.valid){
      // // console.log(this.uploadForm.value)
      this.ngxloading  = true;
      let web3 = this.casService.init();

      let csv = this.csvRecords;
      // // console.log(csv);
      let a = this.haveFileError(csv,web3);
      // console.log(a,"a")
      if(a==1){
        this.ngxloading  = false;
        this.logServ.putErrorInPouch("uploadcsv()","File error while submitting","Some issue with uploaded file","2");        

        this.snackBar.open('The file content is wrong.'+this.recordTOSendMsg1+this.recordTOSendMsg2+' Correct it.','',{
          duration:5000
        }).afterDismissed().subscribe(d=>{
          this.recordTOSendMsg1 = "";
          this.recordTOSendMsg2 = "";
        });
      } 
      else if(this.uploadForm.value.address == null || this.uploadForm.value.address == ""){
        this.ngxloading  = false;
        this.snackBar.open('Address is required','Undo',{
          duration:2000
        });
      }
      else if(!web3.utils.isAddress(this.uploadForm.value.address)){
        this.ngxloading  = false;
        this.snackBar.open('Your address is invalid','Undo',{
          duration:2000
        });
      }
      else{
        // this.casService.returnCompiledContract()
        // .then(
        //   d=>{
        //     // console.log(d)
        //     this.ngxloading  = false;
        //     this.snackBar.open('File Uploaded Successfully','',{
        //       duration:4000
        //     }).afterOpened().subscribe((d)=>{
        //       let data = {
        //         filedata:this.uploadForm.value,
        //         fileContent:this.fileContent,
        //         csvData:this.csvRecords
        //       }
        //       this.mycryptoService.saveToLocal("SISFileUploadContent",JSON.stringify(data));
        //       this.openModal();
        //       // // console.log(data,JSON.stringify(this.mycryptoService.retrieveFromLocal("SISFileUploadContent")));
        //     });
        //   },
        //   e=>{
        //     this.ngxloading  = false;
        //     this.snackBar.open('File unable to upload','Undo',{
        //       duration:2000
        //     });
        //   }
        // );

        this.calculatingFee();
      }
      
    }else{
      // // console.log("Invalid file")
      if(this.uploadForm.value.ufile == null || this.uploadForm.value.ufile == ""){
        this.ngxloading  = false;
        this.snackBar.open('No file choosen','Undo',{
          duration:2000
        });
      }else if(this.uploadForm.value.address == null || this.uploadForm.value.address == ""){
        this.ngxloading  = false;
        this.snackBar.open('Address is required','Undo',{
          duration:2000
        });
      }
      else{
        this.snackBar.open('No file choosen or Invalid file','Undo',{
          duration:1000
        });
      }
    } 
  }

  openModal(){
    const dialogRef = this.dialog.open(UserhomemodelComponent, {
      height: '480px',
      width:'540px',
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.uploadForm.reset();
      this.csvfile.nativeElement.value = "";
    });
  }

  calculatingFee(){ // its call after contract deployed
    let web3 = this.casService.init();
    let data = {
      filedata:this.uploadForm.value,
      fileContent:this.fileContent,
      csvData:this.csvRecords
    }
    this.mycryptoService.saveToLocal("SISFileUploadContent",JSON.stringify(data));
    
    this.ngxloading  = false;
    let ContractABI = this.mycryptoService.retrieveFromLocal("SISContractABI");
    let ContractByteCode = this.mycryptoService.retrieveFromLocal("SISContractByteCode");
    let ContractData = this.mycryptoService.retrieveFromLocal("SISContractData");
    let ContractAddress = this.mycryptoService.retrieveFromLocal("SISContractAddress");
    // // console.log(
    //   ContractAddress
    // );
    var contract = new web3.eth.Contract(JSON.parse(ContractABI.toString()),ContractAddress);
            
    let firstAddr = this.csvRecords;
    let firstAdd = firstAddr[0][0];
    // // console.log(firstAdd)

    var gasLimit = web3.eth.estimateGas({ 
      to: firstAdd, // data: '0x' + bytecode, 
      data: ContractData, // from: wallet.address, 
    }).then(
      valgas =>{
        // // console.log(valgas)
        // // console.log(gasLimit)
        var gasLimit = 1302200;//1302200;
        const gasPrice = web3.eth.getGasPrice();//1800000000;
        
        const nonce = web3.eth.getTransactionCount(firstAdd);

        var nonceHex;
        Promise.all([gasPrice,nonce])
        .then(
          (d)=>{
            // // console.log("gasPrice:",d[0])
            // // console.log("gasLimit:",gasLimit)
            // // console.log("nonce:",d[1])
            const gasPriceHex = web3.utils.toHex(d[0]);
            const gasLimitHex = web3.utils.toHex(gasLimit);//valgas);
            var nonceHex = web3.utils.toHex(d[1]);

            let calculateFee = valgas*d[0];
            // // console.log("calculate:",calculateFee)
            let fromwei = web3.utils.fromWei(calculateFee.toString(),'ether');


            //append for 
            // var contract = new web3.eth.Contract(JSON.parse(ContractABI.toString()),"0x4663461631ee232c342f6f3b10af91f00f7835d1");
            let a1 = new Promise((resolve,reject)=>{
              contract.methods.balanceOf(this.uploadForm.value.address)
               .call(
                 (err,bal)=>{
                   // console.log(err,bal)
                   if(err){
                     reject(err);
                   }
                   if(bal){
                     resolve(bal)
                   }
                 }
               )
             })
            let a2 = web3.eth.getBalance(this.uploadForm.value.address);
            Promise.all([a1,a2])
            .then(
              val=>{
                // console.log(val)
                this.mycryptoService.saveToLocal("SISFeeCalc",JSON.stringify({
                  individual:fromwei,
                  total:fromwei*5,
                  cas:web3.utils.fromWei(val[0],'ether'),
                  eth:web3.utils.fromWei(val[1],'ether')
                })) 
                this.mycryptoService.saveToLocal("SISTokenTransferFromAddress",this.uploadForm.value.address);
                this.activityServ.putActivityInPouch("UserhomeComponent","calculatingFee()","From uploadcsv validating form user open modal for multiple token transfer","uploadcsv() method and succeeded and successfully opened modal for multiple token transfer");        
        
                this.openModal(); 
              }
            )


            // // console.log("fromwei",fromwei,fromwei*5, this.mycryptoService.retrieveFromLocal("SISFeeCalc"));
          }
        )
      }
    );


  }

  /**
   * 
   * Contract Detail
   * 
   */
  contractDetails(){
    // let abi = [{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}];
    // let bytecode = '6060604052341561000f57600080fd5b6102208061001e6000396000f3006060604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166318160ddd811461005b57806370a0823114610080578063a9059cbb1461009f575b600080fd5b341561006657600080fd5b61006e6100d5565b60405190815260200160405180910390f35b341561008b57600080fd5b61006e600160a060020a03600435166100db565b34156100aa57600080fd5b6100c1600160a060020a03600435166024356100f6565b604051901515815260200160405180910390f35b60005481565b600160a060020a031660009081526001602052604090205490565b6000600160a060020a038316151561010d57600080fd5b600160a060020a033316600090815260016020526040902054610136908363ffffffff6101cc16565b600160a060020a03338116600090815260016020526040808220939093559085168152205461016b908363ffffffff6101de16565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a350600192915050565b6000828211156101d857fe5b50900390565b6000828201838110156101ed57fe5b93925050505600a165627a7a723058207735777af67e70477269ee2e843019454e66ab42454d766f23c05b76e767040e0029';
    var creating_address = this.mycryptoService.retrieveFromLocal("SISUAddress");
    var priv = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");

    // // console.log("creating_addr:",creating_address,"priv:",priv);
    
    let existabi = this.mycryptoService.retrieveFromLocal("SISContractByteCode");
    if(existabi == null || existabi == ""){

      // console.log("new detail");

      // let abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"burnAmount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"name":"setTokenInformation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradeAgent","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"releaseTokenTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradeMaster","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"releaseFinalizationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getUpgradeState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"released","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"canUpgrade","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalUpgraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"agent","type":"address"}],"name":"setUpgradeAgent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isToken","outputs":[{"name":"weAre","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BURN_ADDRESS","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"master","type":"address"}],"name":"setUpgradeMaster","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_totalSupply","type":"uint256"},{"name":"_decimals","type":"uint256"},{"name":"_releaseFinalizationDate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newName","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"UpdatedTokenInformation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Upgrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"agent","type":"address"}],"name":"UpgradeAgentSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"burner","type":"address"},{"indexed":false,"name":"burnedAmount","type":"uint256"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
      // let bytecode = '60606040526009805460ff1916905534156200001a57600080fd5b6040516200165238038062001652833981016040528080519190602001805182019190602001805182019190602001805191906020018051919060200180519150505b855b60038054600160a060020a031916600160a060020a0383161790555b50600685805162000091929160200190620000dc565b506007848051620000a7929160200190620000dc565b5060008381556008839055600160a060020a0387168152600160205260409020839055600a8190555b50505050505062000186565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200011f57805160ff19168380011785556200014f565b828001600101855582156200014f579182015b828111156200014f57825182559160200191906001019062000132565b5b506200015e92915062000162565b5090565b6200018391905b808211156200015e576000815560010162000169565b5090565b90565b6114bc80620001966000396000f300606060405236156101515763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde038114610156578063095ea7b3146101e157806318160ddd1461021757806323b872dd1461023c578063313ce5671461027857806342966c681461029d57806345977d03146102b55780634eee966f146102cd5780635de4ccb0146103625780635f412d4f14610391578063600440cb146103a657806366188463146103d55780636748a0c61461040b57806370a08231146104305780638444b3911461046157806395d89b411461049857806396132521146105235780639738968c1461054a578063a9059cbb14610571578063c752ff62146105a7578063d73dd623146105cc578063d7e7088a14610602578063dd62ed3e14610623578063eefa597b1461054a578063fccc281314610681578063ffeb7d75146106b0575b600080fd5b341561016157600080fd5b6101696106d1565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101a65780820151818401525b60200161018d565b50505050905090810190601f1680156101d35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101ec57600080fd5b610203600160a060020a036004351660243561076f565b604051901515815260200160405180910390f35b341561022257600080fd5b61022a6107dc565b60405190815260200160405180910390f35b341561024757600080fd5b610203600160a060020a03600435811690602435166044356107e2565b604051901515815260200160405180910390f35b341561028357600080fd5b61022a61090e565b60405190815260200160405180910390f35b34156102a857600080fd5b6102b3600435610914565b005b34156102c057600080fd5b6102b36004356109f0565b005b34156102d857600080fd5b6102b360046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528181529291906020840183838082843750949650610b7595505050505050565b005b341561036d57600080fd5b610375610d29565b604051600160a060020a03909116815260200160405180910390f35b341561039c57600080fd5b6102b3610d38565b005b34156103b157600080fd5b610375610d63565b604051600160a060020a03909116815260200160405180910390f35b34156103e057600080fd5b610203600160a060020a0360043516602435610d72565b604051901515815260200160405180910390f35b341561041657600080fd5b61022a610e6e565b60405190815260200160405180910390f35b341561043b57600080fd5b61022a600160a060020a0360043516610e74565b60405190815260200160405180910390f35b341561046c57600080fd5b610474610e93565b6040518082600481111561048457fe5b60ff16815260200191505060405180910390f35b34156104a357600080fd5b610169610ee0565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101a65780820151818401525b60200161018d565b50505050905090810190601f1680156101d35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561052e57600080fd5b610203610f7e565b604051901515815260200160405180910390f35b341561055557600080fd5b610203610f87565b604051901515815260200160405180910390f35b341561057c57600080fd5b610203600160a060020a0360043516602435610f8d565b604051901515815260200160405180910390f35b34156105b257600080fd5b61022a610fbe565b60405190815260200160405180910390f35b34156105d757600080fd5b610203600160a060020a0360043516602435610fc4565b604051901515815260200160405180910390f35b341561060d57600080fd5b6102b3600160a060020a0360043516611069565b005b341561062e57600080fd5b61022a600160a060020a0360043581169060243516611254565b60405190815260200160405180910390f35b341561055557600080fd5b610203610f87565b604051901515815260200160405180910390f35b341561068c57600080fd5b610375611287565b604051600160a060020a03909116815260200160405180910390f35b34156106bb57600080fd5b6102b3600160a060020a036004351661128c565b005b60068054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107675780601f1061073c57610100808354040283529160200191610767565b820191906000526020600020905b81548152906001019060200180831161074a57829003601f168201915b505050505081565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a35060015b92915050565b60005481565b600080600160a060020a03841615156107fa57600080fd5b50600160a060020a03808516600081815260026020908152604080832033909516835293815283822054928252600190529190912054610840908463ffffffff6112e816565b600160a060020a038087166000908152600160205260408082209390935590861681522054610875908463ffffffff6112ff16565b600160a060020a03851660009081526001602052604090205561089e818463ffffffff6112e816565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3600191505b509392505050565b60085481565b33600160a060020a03811660009081526001602052604090205461093890836112e8565b600160a060020a03821660009081526001602052604081209190915554610965908363ffffffff6112e816565b6000557f696de425f79f4a40bc6d2122ca50507f0efbeabbff86a84871b7196ab8ea8df78183604051600160a060020a03909216825260208201526040908101905180910390a16000600160a060020a0382167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405190815260200160405180910390a35b5050565b60006109fa610e93565b905060035b816004811115610a0b57fe5b1480610a23575060045b816004811115610a2157fe5b145b1515610a2e57600080fd5b811515610a3a57600080fd5b600160a060020a033316600090815260016020526040902054610a63908363ffffffff6112e816565b600160a060020a03331660009081526001602052604081209190915554610a90908363ffffffff6112e816565b600055600554610aa6908363ffffffff6112ff16565b600555600454600160a060020a031663753e88e533846040517c010000000000000000000000000000000000000000000000000000000063ffffffff8516028152600160a060020a0390921660048301526024820152604401600060405180830381600087803b1515610b1857600080fd5b6102c65a03f11515610b2957600080fd5b5050600454600160a060020a03908116915033167f7e5c344a8141a805725cb476f76c6953b842222b967edd1f78ddb6e8b3f397ac8460405190815260200160405180910390a35b5050565b60035433600160a060020a03908116911614610b9057600080fd5b600060068054600181600116156101000203166002900490501180610bcb575060006007805460018160011615610100020316600290049050115b15610bd557600080fd5b6006828051610be89291602001906113f0565b506007818051610bfc9291602001906113f0565b507fd131ab1e6f279deea74e13a18477e13e2107deb6dc8ae955648948be5841fb4660066007604051604080825283546002600019610100600184161502019091160490820181905281906020820190606083019086908015610ca05780601f10610c7557610100808354040283529160200191610ca0565b820191906000526020600020905b815481529060010190602001808311610c8357829003601f168201915b5050838103825284546002600019610100600184161502019091160480825260209091019085908015610d145780601f10610ce957610100808354040283529160200191610d14565b820191906000526020600020905b815481529060010190602001808311610cf757829003601f168201915b505094505050505060405180910390a15b5050565b600454600160a060020a031681565b60035433600160a060020a03908116911614610d5357600080fd5b6009805460ff191660011790555b565b600354600160a060020a031681565b600160a060020a03338116600090815260026020908152604080832093861683529290529081205480831115610dcf57600160a060020a033381166000908152600260209081526040808320938816835292905290812055610e06565b610ddf818463ffffffff6112e816565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a3600191505b5092915050565b600a5481565b600160a060020a0381166000908152600160205260409020545b919050565b6000610e9d610f87565b1515610eab57506001610eda565b600454600160a060020a03161515610ec557506002610eda565b6005541515610ed657506003610eda565b5060045b5b5b5b90565b60078054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107675780601f1061073c57610100808354040283529160200191610767565b820191906000526020600020905b81548152906001019060200180831161074a57829003601f168201915b505050505081565b60095460ff1681565b60015b90565b6000600a54421115610faa5760095460ff161515610faa57600080fd5b5b610fb58383611319565b90505b92915050565b60055481565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054610ffc908363ffffffff6112ff16565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a35060015b92915050565b611071610f87565b151561107c57600080fd5b600160a060020a038116151561109157600080fd5b60035433600160a060020a039081169116146110ac57600080fd5b60045b6110b7610e93565b60048111156110c257fe5b14156110cd57600080fd5b6004805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038381169190911791829055166361d3d7a66000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b151561115157600080fd5b6102c65a03f1151561116257600080fd5b50505060405180519050151561117757600080fd5b600080546004549091600160a060020a0390911690634b2ba0dd90604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15156111e057600080fd5b6102c65a03f115156111f157600080fd5b5050506040518051905014151561120757600080fd5b6004547f7845d5aa74cc410e35571258d954f23b82276e160fe8c188fa80566580f279cc90600160a060020a0316604051600160a060020a03909116815260200160405180910390a15b50565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b60015b90565b600081565b600160a060020a03811615156112a157600080fd5b60035433600160a060020a039081169116146112bc57600080fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b50565b6000828211156112f457fe5b508082035b92915050565b60008282018381101561130e57fe5b8091505b5092915050565b6000600160a060020a038316151561133057600080fd5b600160a060020a033316600090815260016020526040902054611359908363ffffffff6112e816565b600160a060020a03338116600090815260016020526040808220939093559085168152205461138e908363ffffffff6112ff16565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b92915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061143157805160ff191683800117855561145e565b8280016001018555821561145e579182015b8281111561145e578251825591602001919060010190611443565b5b5061146b92915061146f565b5090565b610eda91905b8082111561146b5760008155600101611475565b5090565b905600a165627a7a723058204efbd132c7fdb212c5c4d7e19c27bd7cc02e84b17e951816e2b32c05d61ef9e700290000000000000000000000006efd5665ab4b345a7ebe63c679b651f375dddb7e00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000033b2e3c9fd0803ce80000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000005b117b900000000000000000000000000000000000000000000000000000000000000006436173686161000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034341530000000000000000000000000000000000000000000000000000000000';
      let abi = [{"constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "approve", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "transferFrom", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "burnAmount", "type": "uint256"} ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "value", "type": "uint256"} ], "name": "upgrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"} ], "name": "setTokenInformation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "upgradeAgent", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [], "name": "releaseTokenTransfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "upgradeMaster", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_subtractedValue", "type": "uint256"} ], "name": "decreaseApproval", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "releaseFinalizationDate", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"} ], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getUpgradeState", "outputs": [{"name": "", "type": "uint8"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "released", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "canUpgrade", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "transfer", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalUpgraded", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_addedValue", "type": "uint256"} ], "name": "increaseApproval", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "agent", "type": "address"} ], "name": "setUpgradeAgent", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"} ], "name": "allowance", "outputs": [{"name": "remaining", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "isToken", "outputs": [{"name": "weAre", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "BURN_ADDRESS", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "master", "type": "address"} ], "name": "setUpgradeMaster", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"name": "_owner", "type": "address"}, {"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"}, {"name": "_totalSupply", "type": "uint256"}, {"name": "_decimals", "type": "uint256"}, {"name": "_releaseFinalizationDate", "type": "uint256"} ], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "newName", "type": "string"}, {"indexed": false, "name": "newSymbol", "type": "string"} ], "name": "UpdatedTokenInformation", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {"indexed": true, "name": "_to", "type": "address"}, {"indexed": false, "name": "_value", "type": "uint256"} ], "name": "Upgrade", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "agent", "type": "address"} ], "name": "UpgradeAgentSet", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "burner", "type": "address"}, {"indexed": false, "name": "burnedAmount", "type": "uint256"} ], "name": "Burned", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"} ], "name": "Approval", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"} ], "name": "Transfer", "type": "event"} ];
      let bytecode = '60606040526009805460ff1916905534156200001a57600080fd5b604051620013c2380380620013c28339810160405280805191906020018051820191906020018051820191906020018051919060200180519190602001805160038054600160a060020a031916600160a060020a038a161790559150600690508580516200008d929160200190620000d1565b506007848051620000a3929160200190620000d1565b506000838155600892909255600160a060020a039095168152600160205260409020555050600a5562000176565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200011457805160ff191683800117855562000144565b8280016001018555821562000144579182015b828111156200014457825182559160200191906001019062000127565b506200015292915062000156565b5090565b6200017391905b808211156200015257600081556001016200015d565b90565b61123c80620001866000396000f30060606040526004361061013a5763ffffffff60e060020a60003504166306fdde03811461013f578063095ea7b3146101c957806318160ddd146101ff57806323b872dd14610224578063313ce5671461024c57806342966c681461025f57806345977d03146102775780634eee966f1461028d5780635de4ccb0146103205780635f412d4f1461034f578063600440cb1461036257806366188463146103755780636748a0c61461039757806370a08231146103aa5780638444b391146103c957806395d89b411461040057806396132521146104135780639738968c14610426578063a9059cbb14610439578063c752ff621461045b578063d73dd6231461046e578063d7e7088a14610490578063dd62ed3e146104af578063eefa597b14610426578063fccc2813146104d4578063ffeb7d75146104e7575b600080fd5b341561014a57600080fd5b610152610506565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561018e578082015183820152602001610176565b50505050905090810190601f1680156101bb5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101d457600080fd5b6101eb600160a060020a03600435166024356105a4565b604051901515815260200160405180910390f35b341561020a57600080fd5b610212610610565b60405190815260200160405180910390f35b341561022f57600080fd5b6101eb600160a060020a0360043581169060243516604435610616565b341561025757600080fd5b610212610740565b341561026a57600080fd5b610275600435610746565b005b341561028257600080fd5b610275600435610821565b341561029857600080fd5b61027560046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061098a95505050505050565b341561032b57600080fd5b610333610b3d565b604051600160a060020a03909116815260200160405180910390f35b341561035a57600080fd5b610275610b4c565b341561036d57600080fd5b610333610b76565b341561038057600080fd5b6101eb600160a060020a0360043516602435610b85565b34156103a257600080fd5b610212610c7f565b34156103b557600080fd5b610212600160a060020a0360043516610c85565b34156103d457600080fd5b6103dc610ca0565b604051808260048111156103ec57fe5b60ff16815260200191505060405180910390f35b341561040b57600080fd5b610152610cea565b341561041e57600080fd5b6101eb610d55565b341561043157600080fd5b6101eb610d5e565b341561044457600080fd5b6101eb600160a060020a0360043516602435610d63565b341561046657600080fd5b610212610d91565b341561047957600080fd5b6101eb600160a060020a0360043516602435610d97565b341561049b57600080fd5b610275600160a060020a0360043516610e3b565b34156104ba57600080fd5b610212600160a060020a0360043581169060243516610ff2565b34156104df57600080fd5b61033361101d565b34156104f257600080fd5b610275600160a060020a0360043516611022565b60068054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561059c5780601f106105715761010080835404028352916020019161059c565b820191906000526020600020905b81548152906001019060200180831161057f57829003601f168201915b505050505081565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a350600192915050565b60005481565b600080600160a060020a038416151561062e57600080fd5b50600160a060020a03808516600081815260026020908152604080832033909516835293815283822054928252600190529190912054610674908463ffffffff61108116565b600160a060020a0380871660009081526001602052604080822093909355908616815220546106a9908463ffffffff61109316565b600160a060020a0385166000908152600160205260409020556106d2818463ffffffff61108116565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3506001949350505050565b60085481565b33600160a060020a03811660009081526001602052604090205461076a9083611081565b600160a060020a03821660009081526001602052604081209190915554610797908363ffffffff61108116565b6000557f696de425f79f4a40bc6d2122ca50507f0efbeabbff86a84871b7196ab8ea8df78183604051600160a060020a03909216825260208201526040908101905180910390a16000600160a060020a0382167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405190815260200160405180910390a35050565b600061082b610ca0565b9050600381600481111561083b57fe5b14806108525750600481600481111561085057fe5b145b151561085d57600080fd5b81151561086957600080fd5b600160a060020a033316600090815260016020526040902054610892908363ffffffff61108116565b600160a060020a033316600090815260016020526040812091909155546108bf908363ffffffff61108116565b6000556005546108d5908363ffffffff61109316565b600555600454600160a060020a031663753e88e5338460405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401600060405180830381600087803b151561092e57600080fd5b6102c65a03f1151561093f57600080fd5b5050600454600160a060020a03908116915033167f7e5c344a8141a805725cb476f76c6953b842222b967edd1f78ddb6e8b3f397ac8460405190815260200160405180910390a35050565b60035433600160a060020a039081169116146109a557600080fd5b6000600680546001816001161561010002031660029004905011806109e0575060006007805460018160011615610100020316600290049050115b156109ea57600080fd5b60068280516109fd929160200190611178565b506007818051610a11929160200190611178565b507fd131ab1e6f279deea74e13a18477e13e2107deb6dc8ae955648948be5841fb4660066007604051604080825283546002600019610100600184161502019091160490820181905281906020820190606083019086908015610ab55780601f10610a8a57610100808354040283529160200191610ab5565b820191906000526020600020905b815481529060010190602001808311610a9857829003601f168201915b5050838103825284546002600019610100600184161502019091160480825260209091019085908015610b295780601f10610afe57610100808354040283529160200191610b29565b820191906000526020600020905b815481529060010190602001808311610b0c57829003601f168201915b505094505050505060405180910390a15050565b600454600160a060020a031681565b60035433600160a060020a03908116911614610b6757600080fd5b6009805460ff19166001179055565b600354600160a060020a031681565b600160a060020a03338116600090815260026020908152604080832093861683529290529081205480831115610be257600160a060020a033381166000908152600260209081526040808320938816835292905290812055610c19565b610bf2818463ffffffff61108116565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a35060019392505050565b600a5481565b600160a060020a031660009081526001602052604090205490565b6000610caa610d5e565b1515610cb857506001610ce7565b600454600160a060020a03161515610cd257506002610ce7565b6005541515610ce357506003610ce7565b5060045b90565b60078054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561059c5780601f106105715761010080835404028352916020019161059c565b60095460ff1681565b600190565b6000600a54421115610d805760095460ff161515610d8057600080fd5b610d8a83836110a2565b9392505050565b60055481565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054610dcf908363ffffffff61109316565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a350600192915050565b610e43610d5e565b1515610e4e57600080fd5b600160a060020a0381161515610e6357600080fd5b60035433600160a060020a03908116911614610e7e57600080fd5b6004610e88610ca0565b6004811115610e9357fe5b1415610e9e57600080fd5b6004805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038381169190911791829055166361d3d7a66000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b1515610f0957600080fd5b6102c65a03f11515610f1a57600080fd5b505050604051805190501515610f2f57600080fd5b600080546004549091600160a060020a0390911690634b2ba0dd90604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b1515610f7f57600080fd5b6102c65a03f11515610f9057600080fd5b50505060405180519050141515610fa657600080fd5b6004547f7845d5aa74cc410e35571258d954f23b82276e160fe8c188fa80566580f279cc90600160a060020a0316604051600160a060020a03909116815260200160405180910390a150565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b600081565b600160a060020a038116151561103757600080fd5b60035433600160a060020a0390811691161461105257600080fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60008282111561108d57fe5b50900390565b600082820183811015610d8a57fe5b6000600160a060020a03831615156110b957600080fd5b600160a060020a0333166000908152600160205260409020546110e2908363ffffffff61108116565b600160a060020a033381166000908152600160205260408082209390935590851681522054611117908363ffffffff61109316565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a350600192915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106111b957805160ff19168380011785556111e6565b828001600101855582156111e6579182015b828111156111e65782518255916020019190600101906111cb565b506111f29291506111f6565b5090565b610ce791905b808211156111f257600081556001016111fc5600a165627a7a723058200e73aee9c0e4807afbe42945ee1829a60d3a222714b9b7dc2ea205c5695027d80029';

      let web3 = this.casService.init();
      // var contract = new web3.eth.Contract(abi,"0xe8780B48bdb05F928697A5e8155f672ED91462F7");
      // var contract = new web3.eth.Contract(abi);
      // // console.log("contract",contract)
      // var contractData = contract.deploy({
      //   method:'constructor',
      //   arguments:[creating_address,"cashaa","CAS",10000,18,1527872400],
      //   data:'0x'+bytecode
      // }).encodeABI();
        

      // // console.log("cdata",contractData)
      this.mycryptoService.saveToLocal("SISContractABI",JSON.stringify(abi));
      this.mycryptoService.saveToLocal("SISContractByteCode",bytecode);
      // this.mycryptoService.saveToLocal("SISContractData",contractData);
      this.mycryptoService.saveToLocal("SISContractAddress","0xe8780B48bdb05F928697A5e8155f672ED91462F7");//"0xe8780B48bdb05F928697A5e8155f672ED91462F7");
    }else{ 
      // console.log("contract detail already stored")
    }
    // console.log(this.mycryptoService.retrieveFromLocal("SISContractABI"))
      //  contract.methods.balanceOf("0x6f0f9babd45e9bb786f9a736a14d555b48e85104")
      //  .call(
      //    (err,bal)=>{
      //     // console.log(err,bal)
      //    }
      //  )

      // web3.eth.getBalance("0x6f0f9babd45e9bb786f9a736a14d555b48e85104")
      // .then(
      //   d=>{
      //     // console.log(d);
      //   }
      // )

        // this.mycryptoService.saveToLocal("SISContractBlockHash",dd.blockHash);
        // this.mycryptoService.saveToLocal("SISContractAddress",dd.contractAddress);
        // this.mycryptoService.saveToLocal("SISContractTxHash",dd.transactionHash);
        // this.mycryptoService.saveToLocal("SISContractReceiptDetail",JSON.stringify(dd));

        // var gasLimit = 1302200;//1302200;
        // const gasPrice = web3.eth.getGasPrice();//1800000000;
        
        // const nonce = web3.eth.getTransactionCount(creating_address);

        // var nonceHex;
        // Promise.all([gasPrice,nonce])
        // .then(
        //   (d)=>{
        //     // // console.log(d)

        //     const gasPriceHex = web3.utils.toHex(d[0]);
        //     const gasLimitHex = web3.utils.toHex(gasLimit);//valgas);

        //         // // console.log(d)
        //         var nonceHex = web3.utils.toHex(d[1]);

        //         const rawTx = {
        //           nonce: nonceHex,
        //           gasPrice: gasPriceHex,
        //           gasLimit: gasLimitHex,
        //           data: contractData,
        //           from: creating_address
        //         };

        //         // // console.log("\n\n\n Rawtx:", rawTx);

        //         // let calculateFee = valgas*d[0];
        //         // // console.log(calculateFee)
        //         // let fromwei = this.web3.utils.fromWei(calculateFee.toString(),'ether');
        //         // // // console.log("fromwei",fromwei);

        //         const tx = new Tx(rawTx);
        //         // // console.log("sadasdsad", tx.serialize().toString('hex'));
        //         var pk = priv.toString();
        //         pk = pk.substr(2,pk.length);
        //         var pk2 = Buffer.Buffer.from(pk,'hex');
        //         tx.sign(pk2);
        //         const serializedTx = tx.serialize();
        //         web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"))
        //         .on('receipt', (dd)=>{
        //           // console.log('receipt',dd)


        //           var contract = new web3.eth.Contract(abi,dd.contractAddress);
        //           // console.log("contract",contract)
        //           contract.methods.balanceOf(creating_address)
        //           .call(
        //             (err,bal)=>{
        //             // console.log(err,bal)
        //             }
        //           )
        //           contract.methods.name()
        //           .call(
        //             (err,bal)=>{
        //             // console.log(err,bal)
        //             }
        //           )
        //           // this.mycryptoService.saveToLocal("SISContractBlockHash",dd.blockHash);
        //           // this.mycryptoService.saveToLocal("SISContractAddress",dd.contractAddress);
        //           // this.mycryptoService.saveToLocal("SISContractTxHash",dd.transactionHash);
        //           // this.mycryptoService.saveToLocal("SISContractReceiptDetail",JSON.stringify(dd));
                  
        //           // // console.log(
        //           //   this.mycryptoService.retrieveFromLocal("SISContractBlockHash"),
        //           //   this.mycryptoService.retrieveFromLocal("SISContractAddress"),
        //           //   this.mycryptoService.retrieveFromLocal("SISContractTxHash"),
        //           //   this.mycryptoService.retrieveFromLocal("SISContractReceiptDetail")
        //           // )
                  
        //           // resolve(dd)
        //         })
        //         .on('error',(ee)=>{
        //           // console.log('error:',ee)
        //           // reject(ee)
        //         });

        //   }
        // )
    
  }

  saveNewDetail(){
    // creating_addr: 0x24775D755d8d8C48D917F86Efcc36eb0d59b2aD9 priv: 0x42c10ce7f8945afd9958eeb6666502360e9a7c8388e6846ae1891f7f467c6386
    
    this.mycryptoService.saveToLocal("SISUAddress","0xcD0f4B8aC1079E894394448880B90e23d1a7C72e");
    this.mycryptoService.saveToLocal("SISUPrivateKey","bff6ee37dd35f9adc1bb26c0dce1149468cf70f130393f2376c9ef41d0e6fa32");
    this.mycryptoService.saveToLocal("SISContractAddress","0xe8780B48bdb05F928697A5e8155f672ED91462F7");

    let add = this.mycryptoService.retrieveFromLocal("SISUAddress");
    var priv = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");
    // console.log(add,priv)
  }

  /***
   * 
   * Single Tokens
   * 
   */
  singleaddress:any;
  singletokens:any;
  singlefromaddress:any;
  @ViewChild('singleaddr') singleaddr:ElementRef;
  @ViewChild('singletkns') singletkns:ElementRef;
  @ViewChild('singlefrmaddr') singlefrmaddr:ElementRef;
  singlenext(){
    this.ngxloading  = true;
    let web3 = this.casService.init();
    if(this.singleaddress == null || this.singleaddress == ""){
      this.ngxloading  = false;
      this.snackBar.open('To address is empty','',{
        duration:2000
      });
    }
    else if(this.singlefromaddress == null || this.singlefromaddress == ""){
      this.ngxloading  = false;
      this.snackBar.open('From address is empty','',{
        duration:2000
      });
    }
    else if(this.singletokens == null || this.singletokens == ""){
      this.ngxloading  = false;
      this.snackBar.open('Tokens is empty','',{
        duration:2000
      });
    }
    else if(!web3.utils.isAddress(this.singleaddress)){
      this.ngxloading  = false;
      this.snackBar.open('To address is invalid','',{
        duration:2000
      });
    }
    else if(!web3.utils.isAddress(this.singlefromaddress)){
      this.ngxloading  = false;
      this.snackBar.open('From address is invalid','',{
        duration:2000
      });
    }
    else if(this.singletokens == "0" || this.singletokens == 0){
      this.ngxloading  = false;
      this.snackBar.open('Tokens may be differ or more than 0','',{
        duration:2000
      });
    }
    else{ 
      this.mycryptoService.saveToLocal("SISContractAddress","0xe8780B48bdb05F928697A5e8155f672ED91462F7");

      let ContractABI = this.mycryptoService.retrieveFromLocal("SISContractABI");
      let ContractByteCode = this.mycryptoService.retrieveFromLocal("SISContractByteCode");
      let ContractData = this.mycryptoService.retrieveFromLocal("SISContractData");
      let ContractAddress = this.mycryptoService.retrieveFromLocal("SISContractAddress");
      let firstAdd = this.singleaddress;
 
      let abi = [{"constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "approve", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "transferFrom", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "burnAmount", "type": "uint256"} ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "value", "type": "uint256"} ], "name": "upgrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"} ], "name": "setTokenInformation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "upgradeAgent", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [], "name": "releaseTokenTransfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "upgradeMaster", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_subtractedValue", "type": "uint256"} ], "name": "decreaseApproval", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "releaseFinalizationDate", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"} ], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getUpgradeState", "outputs": [{"name": "", "type": "uint8"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "released", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "canUpgrade", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "transfer", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalUpgraded", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_addedValue", "type": "uint256"} ], "name": "increaseApproval", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "agent", "type": "address"} ], "name": "setUpgradeAgent", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"} ], "name": "allowance", "outputs": [{"name": "remaining", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "isToken", "outputs": [{"name": "weAre", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "BURN_ADDRESS", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "master", "type": "address"} ], "name": "setUpgradeMaster", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"name": "_owner", "type": "address"}, {"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"}, {"name": "_totalSupply", "type": "uint256"}, {"name": "_decimals", "type": "uint256"}, {"name": "_releaseFinalizationDate", "type": "uint256"} ], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "newName", "type": "string"}, {"indexed": false, "name": "newSymbol", "type": "string"} ], "name": "UpdatedTokenInformation", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {"indexed": true, "name": "_to", "type": "address"}, {"indexed": false, "name": "_value", "type": "uint256"} ], "name": "Upgrade", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "agent", "type": "address"} ], "name": "UpgradeAgentSet", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "burner", "type": "address"}, {"indexed": false, "name": "burnedAmount", "type": "uint256"} ], "name": "Burned", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"} ], "name": "Approval", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"} ], "name": "Transfer", "type": "event"} ];
      let bytecode = '60606040526009805460ff1916905534156200001a57600080fd5b604051620013c2380380620013c28339810160405280805191906020018051820191906020018051820191906020018051919060200180519190602001805160038054600160a060020a031916600160a060020a038a161790559150600690508580516200008d929160200190620000d1565b506007848051620000a3929160200190620000d1565b506000838155600892909255600160a060020a039095168152600160205260409020555050600a5562000176565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200011457805160ff191683800117855562000144565b8280016001018555821562000144579182015b828111156200014457825182559160200191906001019062000127565b506200015292915062000156565b5090565b6200017391905b808211156200015257600081556001016200015d565b90565b61123c80620001866000396000f30060606040526004361061013a5763ffffffff60e060020a60003504166306fdde03811461013f578063095ea7b3146101c957806318160ddd146101ff57806323b872dd14610224578063313ce5671461024c57806342966c681461025f57806345977d03146102775780634eee966f1461028d5780635de4ccb0146103205780635f412d4f1461034f578063600440cb1461036257806366188463146103755780636748a0c61461039757806370a08231146103aa5780638444b391146103c957806395d89b411461040057806396132521146104135780639738968c14610426578063a9059cbb14610439578063c752ff621461045b578063d73dd6231461046e578063d7e7088a14610490578063dd62ed3e146104af578063eefa597b14610426578063fccc2813146104d4578063ffeb7d75146104e7575b600080fd5b341561014a57600080fd5b610152610506565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561018e578082015183820152602001610176565b50505050905090810190601f1680156101bb5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101d457600080fd5b6101eb600160a060020a03600435166024356105a4565b604051901515815260200160405180910390f35b341561020a57600080fd5b610212610610565b60405190815260200160405180910390f35b341561022f57600080fd5b6101eb600160a060020a0360043581169060243516604435610616565b341561025757600080fd5b610212610740565b341561026a57600080fd5b610275600435610746565b005b341561028257600080fd5b610275600435610821565b341561029857600080fd5b61027560046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061098a95505050505050565b341561032b57600080fd5b610333610b3d565b604051600160a060020a03909116815260200160405180910390f35b341561035a57600080fd5b610275610b4c565b341561036d57600080fd5b610333610b76565b341561038057600080fd5b6101eb600160a060020a0360043516602435610b85565b34156103a257600080fd5b610212610c7f565b34156103b557600080fd5b610212600160a060020a0360043516610c85565b34156103d457600080fd5b6103dc610ca0565b604051808260048111156103ec57fe5b60ff16815260200191505060405180910390f35b341561040b57600080fd5b610152610cea565b341561041e57600080fd5b6101eb610d55565b341561043157600080fd5b6101eb610d5e565b341561044457600080fd5b6101eb600160a060020a0360043516602435610d63565b341561046657600080fd5b610212610d91565b341561047957600080fd5b6101eb600160a060020a0360043516602435610d97565b341561049b57600080fd5b610275600160a060020a0360043516610e3b565b34156104ba57600080fd5b610212600160a060020a0360043581169060243516610ff2565b34156104df57600080fd5b61033361101d565b34156104f257600080fd5b610275600160a060020a0360043516611022565b60068054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561059c5780601f106105715761010080835404028352916020019161059c565b820191906000526020600020905b81548152906001019060200180831161057f57829003601f168201915b505050505081565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a350600192915050565b60005481565b600080600160a060020a038416151561062e57600080fd5b50600160a060020a03808516600081815260026020908152604080832033909516835293815283822054928252600190529190912054610674908463ffffffff61108116565b600160a060020a0380871660009081526001602052604080822093909355908616815220546106a9908463ffffffff61109316565b600160a060020a0385166000908152600160205260409020556106d2818463ffffffff61108116565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3506001949350505050565b60085481565b33600160a060020a03811660009081526001602052604090205461076a9083611081565b600160a060020a03821660009081526001602052604081209190915554610797908363ffffffff61108116565b6000557f696de425f79f4a40bc6d2122ca50507f0efbeabbff86a84871b7196ab8ea8df78183604051600160a060020a03909216825260208201526040908101905180910390a16000600160a060020a0382167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405190815260200160405180910390a35050565b600061082b610ca0565b9050600381600481111561083b57fe5b14806108525750600481600481111561085057fe5b145b151561085d57600080fd5b81151561086957600080fd5b600160a060020a033316600090815260016020526040902054610892908363ffffffff61108116565b600160a060020a033316600090815260016020526040812091909155546108bf908363ffffffff61108116565b6000556005546108d5908363ffffffff61109316565b600555600454600160a060020a031663753e88e5338460405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401600060405180830381600087803b151561092e57600080fd5b6102c65a03f1151561093f57600080fd5b5050600454600160a060020a03908116915033167f7e5c344a8141a805725cb476f76c6953b842222b967edd1f78ddb6e8b3f397ac8460405190815260200160405180910390a35050565b60035433600160a060020a039081169116146109a557600080fd5b6000600680546001816001161561010002031660029004905011806109e0575060006007805460018160011615610100020316600290049050115b156109ea57600080fd5b60068280516109fd929160200190611178565b506007818051610a11929160200190611178565b507fd131ab1e6f279deea74e13a18477e13e2107deb6dc8ae955648948be5841fb4660066007604051604080825283546002600019610100600184161502019091160490820181905281906020820190606083019086908015610ab55780601f10610a8a57610100808354040283529160200191610ab5565b820191906000526020600020905b815481529060010190602001808311610a9857829003601f168201915b5050838103825284546002600019610100600184161502019091160480825260209091019085908015610b295780601f10610afe57610100808354040283529160200191610b29565b820191906000526020600020905b815481529060010190602001808311610b0c57829003601f168201915b505094505050505060405180910390a15050565b600454600160a060020a031681565b60035433600160a060020a03908116911614610b6757600080fd5b6009805460ff19166001179055565b600354600160a060020a031681565b600160a060020a03338116600090815260026020908152604080832093861683529290529081205480831115610be257600160a060020a033381166000908152600260209081526040808320938816835292905290812055610c19565b610bf2818463ffffffff61108116565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a35060019392505050565b600a5481565b600160a060020a031660009081526001602052604090205490565b6000610caa610d5e565b1515610cb857506001610ce7565b600454600160a060020a03161515610cd257506002610ce7565b6005541515610ce357506003610ce7565b5060045b90565b60078054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561059c5780601f106105715761010080835404028352916020019161059c565b60095460ff1681565b600190565b6000600a54421115610d805760095460ff161515610d8057600080fd5b610d8a83836110a2565b9392505050565b60055481565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054610dcf908363ffffffff61109316565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a350600192915050565b610e43610d5e565b1515610e4e57600080fd5b600160a060020a0381161515610e6357600080fd5b60035433600160a060020a03908116911614610e7e57600080fd5b6004610e88610ca0565b6004811115610e9357fe5b1415610e9e57600080fd5b6004805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038381169190911791829055166361d3d7a66000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b1515610f0957600080fd5b6102c65a03f11515610f1a57600080fd5b505050604051805190501515610f2f57600080fd5b600080546004549091600160a060020a0390911690634b2ba0dd90604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b1515610f7f57600080fd5b6102c65a03f11515610f9057600080fd5b50505060405180519050141515610fa657600080fd5b6004547f7845d5aa74cc410e35571258d954f23b82276e160fe8c188fa80566580f279cc90600160a060020a0316604051600160a060020a03909116815260200160405180910390a150565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b600081565b600160a060020a038116151561103757600080fd5b60035433600160a060020a0390811691161461105257600080fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60008282111561108d57fe5b50900390565b600082820183811015610d8a57fe5b6000600160a060020a03831615156110b957600080fd5b600160a060020a0333166000908152600160205260409020546110e2908363ffffffff61108116565b600160a060020a033381166000908152600160205260408082209390935590851681522054611117908363ffffffff61109316565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a350600192915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106111b957805160ff19168380011785556111e6565b828001600101855582156111e6579182015b828111156111e65782518255916020019190600101906111cb565b506111f29291506111f6565b5090565b610ce791905b808211156111f257600081556001016111fc5600a165627a7a723058200e73aee9c0e4807afbe42945ee1829a60d3a222714b9b7dc2ea205c5695027d80029';

      // // console.log(firstAdd)
      this.mycryptoService.saveToLocal("SISTokenTransferToAddress",this.singleaddress);
      this.mycryptoService.saveToLocal("SISTokenTransferTokens",this.singletokens);
      this.mycryptoService.saveToLocal("SISTokenTransferFromAddress",this.singlefromaddress);

      
      var contract = new web3.eth.Contract(JSON.parse(ContractABI.toString()),ContractAddress);//"0x11dc5a650e1e2a32c336fa73439e7cc035976c06");
      // console.log(contract,ContractAddress)
      var gasLimit = web3.eth.estimateGas({ 
        to: firstAdd, // data: '0x' + bytecode, 
        data: ContractData, // from: wallet.address, 
      }).then(
        valgas =>{
          // console.log(valgas)
          // console.log(gasLimit)
          var gasLimit = 1302200;//1302200;
          const gasPrice = web3.eth.getGasPrice();//1800000000;
          
          const nonce = web3.eth.getTransactionCount(firstAdd);

          var nonceHex;
          Promise.all([gasPrice,nonce])
          .then(
            (d)=>{
              // // console.log("gasPrice:",d[0])
              // // console.log("gasLimit:",gasLimit)
              // // console.log("nonce:",d[1])
              const gasPriceHex = web3.utils.toHex(d[0]);
              const gasLimitHex = web3.utils.toHex(gasLimit);//valgas);
              var nonceHex = web3.utils.toHex(d[1]);

              let calculateFee = valgas*d[0];
              // // console.log("calculate:",calculateFee)
              let fromwei = web3.utils.fromWei(calculateFee.toString(),'ether');


              /**
               * Append infor for contract of single transc
               */
              let a1 = new Promise((resolve,reject)=>{
                 contract.methods.balanceOf(this.singlefromaddress)
                  .call(
                    (err,bal)=>{
                      // console.log(err,bal)
                      if(err){
                        reject(err);
                      }
                      if(bal){
                        resolve(bal)
                      }
                    }
                  )
                })
              let a2 = web3.eth.getBalance(this.singlefromaddress);
              Promise.all([a1,a2])
              .then(
                val=>{
                  // console.log(val)
                  this.mycryptoService.saveToLocal("SISFeeCalc",JSON.stringify({
                    individual:fromwei,
                    cas:web3.utils.fromWei(val[0],'ether'),
                    eth:web3.utils.fromWei(val[1],'ether')
                  }))  
                  // console.log("fromwei",fromwei, this.mycryptoService.retrieveFromLocal("SISFeeCalc"));
                  this.ngxloading  = false;
                  this.openModalForSingle();
                  this.activityServ.putActivityInPouch("UserhomeComponent","singlenext()","User visited to send token from single token transfer page.","Navigate to single CAS token transfer");        
        
                }
              )


              
              
            }
          )
          this.singleaddress == "";this.singletokens = '';
        }
      );
    }
  }
  openModalForSingle(){
    const dialogRef = this.dialog.open(UserhomesinglemodelComponent, {
      height: '460px',
      width:'520px',
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.singleaddr.nativeElement.value = "";
      this.singletkns.nativeElement.value = "";
      this.singlefrmaddr.nativeElement.value = "";
      if(result == true){
        
      }
    });
  }
  
  link: HTMLAnchorElement;

  dothese(event){
    event.preventDefault();
    this.casService.readCSV()
    .then(
      d=>{
        let dt = JSON.parse(JSON.stringify(d));
        if(dt.statusText == "OK" || dt.statusText == "ok"){
          // console.log(dt._body)
          let data = dt._body;
          let csv = btoa(data);
          let val =  "data:text/csv;base64,"+csv;
          let filename = "Sample-"+"CAS-Token-Distributor-CSV-"+moment().unix();
          this.downloadURI(val, filename+".csv");
        }else{
          this.snackBar.open('Sample CSV file unable to download','',{
            duration:2000
          });
        }
        this.activityServ.putActivityInPouch("UserhomeComponent","dothese()","Downloaded a sample .csv file.","To know the schema of csv data user downloaded a sample file.");
      },
      e=>{
        // console.log(e) 
        this.logServ.putErrorInPouch("dothese()","File unable to read","Some issue with uploaded file,"+JSON.stringify(e),"1");
        this.snackBar.open('Sample CSV file unable to download','',{
          duration:2000
        });
      }
    )
    
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
