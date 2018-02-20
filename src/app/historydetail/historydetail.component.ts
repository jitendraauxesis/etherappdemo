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
import { Router,  ActivatedRoute,ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap'; //to fetch url params
import { PouchactivityService } from '../service/pouchactivity.service';
import { PouchlogsService } from '../service/pouchlogs.service';
@Component({
  selector: 'app-historydetail',
  templateUrl: './historydetail.component.html',
  styleUrls: ['./historydetail.component.css']
})
export class HistorydetailComponent implements OnInit {
  link: HTMLAnchorElement;

  tableContent:any = [];
  isDataAvailableSingle:boolean = false;
  isDataAvailableMultiple:boolean = false;
  
  public ngxloading  = false;

  isSingle:any;
  isMultiple:any;

  viewAddress:any;
  viewHash:any;

  constructor(
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    public router:Router, 
    public activeroutes:ActivatedRoute,
    public activityServ:PouchactivityService,
    public logServ:PouchlogsService
  ) { }

  ngOnInit() {
    let id = this.activeroutes.snapshot.paramMap.get("id");
    let chk = this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists");
    if(chk == null || chk == ""){
      this.isDataAvailableSingle = false;
      this.isDataAvailableMultiple = false;
    }
    else if(id == "0" || id == null){
      // history.back();
      this.router.navigate(["history"]);
    }
    else{
      
      let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
      console.log(data)
      let find = _.find(data,function(o){if(o.id == id){return o;}}) 
      console.log(this.tableContent,id,find) 
      if(find == undefined || find == null || find == ""){
        this.router.navigate(["history"]);
      }else{
        let distributed = find.distributed;
        if(distributed == "single"){
          this.isDataAvailableSingle = true;
          this.isDataAvailableMultiple = false;
          this.isSingle = find;
        }
        else if(distributed == "multiple"){
          this.isDataAvailableSingle = false;
          this.isDataAvailableMultiple = true;
          this.isMultiple = find;           
        }else{
          this.router.navigate(["history"]);
        }
      }
    }
    // console.log(chk,id)  
    
    this.activityServ.putActivityInPouch("HistorydetailComponent","ngOnInit()","Viewed history page.","");

    this.viewAddress = this.mycryptoService.retrieveFromLocal("ViewTransactionAddressURL");
    this.viewHash = this.mycryptoService.retrieveFromLocal("ViewTransactionHashURL");
    console.log(
      this.viewAddress,this.viewHash
    );
  }

  incr(i){
    i = i+1
    return i;
  }

  convertToDate(timestamp){
    // let date = moment.unix(timestamp).fromNow();//.format("MMM Do, YYYY");
    let date = moment(new Date(timestamp)).format("LLLL");
    return date;
  }

  backlist(){
    this.router.navigateByUrl("/history");
  }

}
