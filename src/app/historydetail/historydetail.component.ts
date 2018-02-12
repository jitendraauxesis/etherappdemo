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
@Component({
  selector: 'app-historydetail',
  templateUrl: './historydetail.component.html',
  styleUrls: ['./historydetail.component.css']
})
export class HistorydetailComponent implements OnInit {
  link: HTMLAnchorElement;

  tableContent:any = [];
  isDataAvailable:boolean = false;
  public ngxloading  = false;
  constructor(
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    public router:Router, 
    public activeroutes:ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.activeroutes.snapshot.paramMap.get("id");
    let chk = this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists");
    if(chk == null || chk == ""){
      this.isDataAvailable = false;
    }
    else if(id == "0" || id == null){
      history.back();
    }
    else{
      this.isDataAvailable = true;
      let data = JSON.parse((this.mycryptoService.retrieveFromLocal("SISDistributedTokenLists")).toString());
      // console.log(data)
      data.forEach((value,key) => {
        this.tableContent.push(value)
      }); 
      console.log(this.tableContent,id) 
    }
    console.log(chk,id)  
    
  }

}
