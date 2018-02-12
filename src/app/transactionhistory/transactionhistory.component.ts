import { Component, OnInit } from '@angular/core';
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
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.component.html',
  styleUrls: ['./transactionhistory.component.css']
})
export class TransactionhistoryComponent implements OnInit {
  link: HTMLAnchorElement;

  tableContent:any = [];
  isDataAvailable:boolean = false;
  public ngxloading  = false;

  constructor(
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    public router:Router
  ) { }

  ngOnInit() {
    let chk = this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists");
    if(chk == null || chk == ""){
      this.isDataAvailable = false;
    }else{
      this.isDataAvailable = true;
      let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
      // console.log(data)
      data.forEach((value,key) => {
        this.tableContent.push(value)
      }); 
      // console.log(this.tableContent)
    }
  }

  convertToDate(timestamp){
    // let date = moment.unix(timestamp).fromNow();//.format("MMM Do, YYYY");
    let date = moment(new Date(timestamp)).fromNow();
    return date;
  }


  fileEXPORTDATA:string = "";
  fileEXPORTDATABASE:any;
  fileEXPORTJSONDATA:any = [];
  fileEXPORTJSONDATABASE:any;
  download(t,type){
    // let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
    // console.log("t",t,type)
    let filename = moment(new Date(t.timestamp)).unix()+"-CAS-Token-Distribution";
    if(type == "csv"){
      if(t.distributed == "single"){
        this.fileEXPORTDATA = "";
        let resp = t.message?t.message:'Successful token transfer'
        this.fileEXPORTDATA = t.toaddress+","+t.tokens+","+t.transactionHash+","+resp;
        this.fileEXPORTDATABASE = btoa(this.fileEXPORTDATA);
        let val =  "data:text/csv;base64,"+this.fileEXPORTDATABASE;
        this.downloadURI(val, filename+".csv");
      }
      else if(t.distributed == "multiple"){
        let data = t.csvData;
        this.fileEXPORTDATA = "";
        data.forEach((value,key) => {
          let resp = value.response?value.response:"Succeessful token transfer";
          // // console.log(value.address+","+value.tokens+","+value.hash+","+resp+"\n")
          this.fileEXPORTDATA =this.fileEXPORTDATA + value.address+","+value.tokens+","+value.hash+","+resp+"\n";
          // // console.log(this.ddumdata)
        });
        // console.log(this.fileEXPORTDATA)
        // // console.log(btoa(this.fileEXPORTDATA))
        this.fileEXPORTDATABASE = btoa(this.fileEXPORTDATA);
        let val =  "data:text/csv;base64,"+this.fileEXPORTDATABASE;
        // let filename = moment(new Date(t.timestamp)).unix()+"-"+t.tokens+"-CAS-Token-Distribution";
        this.downloadURI(val, filename+".csv");
      }else{
        this.snackBar.open('File unable to download','',{
          duration:2000
        });
      }
    }
    else if(type == "json"){
      if(t.distributed == "single"){
        // let resp = t.message?t.message:'Successful token transfer'
        let jdata = {
          toAddress:t.toaddress,
          transactionHash:t.transactionHash,
          tokens:t.tokens,
          notes:t.message
        };
        this.fileEXPORTDATABASE = btoa(JSON.stringify(jdata));
        let val =  "data:application/json;base64,"+this.fileEXPORTDATABASE;
        // // console.log(jdata,this.fileEXPORTDATABASE,val)
        this.downloadURI(val, filename+".json");
      } 
      else if(t.distributed == "multiple"){
        let data = t.csvData;
        this.fileEXPORTJSONDATA = [];
        data.forEach((value,key) => {
          let resp = value.response?value.response:"Succeessful token transfer";
          // // console.log(value.address+","+value.tokens+","+value.hash+","+resp+"\n")
          this.fileEXPORTJSONDATA.push({
            toAddress:value.address,
            transactionHash:value.hash,
            tokens:value.tokens,
            notes:resp
          })
          // // console.log(this.ddumdata)
        });
        // console.log(this.fileEXPORTJSONDATA)
        // // console.log(btoa(JSON.stringify(this.fileEXPORTJSONDATA)))
        this.fileEXPORTJSONDATABASE = btoa(JSON.stringify(this.fileEXPORTJSONDATA));
        let val =  "data:application/json;base64,"+this.fileEXPORTJSONDATABASE;
        // let filename = moment().unix()+"-"+t.tokens+"-CAS-Token-Distribution";
        this.downloadURI(val, filename+".json");
      }else{
        this.snackBar.open('File unable to download','',{
          duration:2000
        });
      }
    }else{
      this.snackBar.open('File unable to download','',{
        duration:2000
      });
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

  viewbtn(t){
    console.log(t)
    this.router.navigate(["history/view",t.id]);
  }
}
