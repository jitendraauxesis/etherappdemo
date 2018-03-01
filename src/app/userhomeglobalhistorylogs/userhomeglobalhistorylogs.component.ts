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
import { Router,ActivatedRoute,ParamMap } from '@angular/router';
import { PouchactivityService } from '../service/pouchactivity.service';
import { PouchlogsService } from '../service/pouchlogs.service';
import { CouchdblogsService } from '../service/couchdblogs.service';

@Component({
  selector: 'app-userhomeglobalhistorylogs',
  templateUrl: './userhomeglobalhistorylogs.component.html',
  styleUrls: ['./userhomeglobalhistorylogs.component.css']
})
export class UserhomeglobalhistorylogsComponent implements OnInit {

  link: HTMLAnchorElement;

  tableContent:any = [];
  isDataAvailable:boolean = false;
  public ngxloading  = false;

  getID:any;
  total:any = 0;
  constructor(
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    public router:Router,
    public activeroutes:ActivatedRoute,
    public activityServ:PouchactivityService,
    public logServ:PouchlogsService,
    public couchdblogsService:CouchdblogsService
  ) { }

  ngOnInit() {
    // this.letlogs();

    let id = this.activeroutes.snapshot.paramMap.get("id");
    if(id == "0" || id == null){
      // history.back();
      this.router.navigate(["logs"]);
    }
    else{ 
      this.getID = id;
      this.letlogs(id);
    }
  }


  letlogs(id){
    this.couchdblogsService.logsforlist(id)
    .then(
      d=>{ 
        let dt = JSON.parse(JSON.stringify(d));
        let body = JSON.parse(dt._body);
        
        let rows = body.loglist;
        // console.log(rows)
        if(rows.length > 0){
          this.isDataAvailable = true;
          // console.log(body)
          this.tableContent = rows;
          this.total = body.logcount;
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
    let date = moment.unix(timestamp).fromNow();//.format("MMM Do, YYYY");
    // let date = moment(new Date(timestamp)).fromNow();
    return date;
  }

  viewbtn(t){
    // console.log(t)
  }

}
