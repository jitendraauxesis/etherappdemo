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
import { PouchactivityService } from '../service/pouchactivity.service';
import { PouchlogsService } from '../service/pouchlogs.service';
import { CouchdblogsService } from '../service/couchdblogs.service';

@Component({
  selector: 'app-userhomeglobalhistory',
  templateUrl: './userhomeglobalhistory.component.html',
  styleUrls: ['./userhomeglobalhistory.component.css']
})
export class UserhomeglobalhistoryComponent implements OnInit {
  link: HTMLAnchorElement;

  tableContent:any = [];
  isDataAvailable:boolean = false;
  public ngxloading  = false;
  total:any = 0;
  constructor(
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    public router:Router,
    public activityServ:PouchactivityService,
    public logServ:PouchlogsService,
    public couchdblogsService:CouchdblogsService
  ) { }

  ngOnInit() {
    this.letlogs();
  }


  letlogs(){
    this.couchdblogsService.logslist()
    .then(
      d=>{
        let dt = JSON.parse(JSON.stringify(d));
        let body = JSON.parse(dt._body);
        
        let rows = body.rows;
        if(rows.length > 0){
          this.isDataAvailable = true;
          // console.log(body)
          this.tableContent = rows;
          this.total = rows.length;
        }else{

          this.isDataAvailable = false;
        }
      },
      e=>{
        this.isDataAvailable = false;
        // console.log(e)
      }
    )
    .catch(
      e=>{
        this.isDataAvailable = false;
        // console.log(e);
      }
    )
  }

  convertToDate(timestamp){
    // let date = moment.unix(timestamp).fromNow();//.format("MMM Do, YYYY");
    let date = moment(new Date(timestamp)).fromNow();
    return date;
  }

  seefull(t){
    this.router.navigate(["logs",t.id])
  }
}
