import { Injectable } from '@angular/core';
import { Http, Response, HttpModule }  from '@angular/http';
import 'rxjs/add/operator/map';
import  PouchDB from 'pouchdb';
import * as moment from 'moment';
import * as _ from 'lodash';
// import * as Raven from 'raven-js';
import * as html2canvas from 'html2canvas';
import {MycryptoService} from './mycrypto.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap'; //to fetch url params

@Injectable()
export class CouchdblogsService {

  pdb2:any;
  checkAppArr:any;

  userIP:any;

  pdb:any = "http://165.227.177.53:5984/casdistributionlogs/";

  ifip = 0;
  constructor(
    public http:Http,
    public serviceapi:MycryptoService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.pdb2 = new PouchDB(this.pdb);
    this.storeIP();
  }

  storeIP(){
    let info = this.serviceapi.retrieveFromLocal("SISAppUserInfo");
    // if(info == "" || info == null || !info){
    if(this.ifip == 0){

      this.http.get("https://freegeoip.net/json/")
      .subscribe(
        d=>{ 
          console.info(d)
          let dt = JSON.parse(JSON.stringify(d));
          let dt2 = JSON.parse(dt._body);
          this.serviceapi.saveToLocal("SISAppUserInfo",dt._body);
          this.userIP = JSON.parse((dt._body).toString());
          // console.log(this.userIP);ca000
          this.ifip = 1;
        },
        e=>{
          this.serviceapi.saveToLocal("SISAppUserInfo",JSON.stringify("Its CASHAA ADDRESS"));          
        }
      )
    }else{
      this.userIP = JSON.parse(info.toString()); 
      console.log(this.userIP); 
    }
  }

  letsIssuing(id,page,func,description,notes,priority,component,severity){
    this.updateIssue(id,page,func,description,notes,priority,component,severity);
  }
  updateIssue(id,page,func,description,notes,priority,component,severity){

    try{
      let userinfo = JSON.parse((this.serviceapi.retrieveFromLocal("SISAppUserInfo")).toString());

      this.pdb2.get(id).then((arr) =>{
        // console.log("then1",arr);

        var list = arr.loglist;
        var getcount = arr.logcount;
        
          let d = list;
          let c = getcount+1;
          let issueid ='log'+c; 
          // d.push(list)
          d.push({
            _id:issueid,
            data:{
              tracker:notes,
              timestamp: new Date(),
              ip:userinfo.ip,
              country:userinfo.country_name,
              city:userinfo.city,
              time_zone:userinfo.time_zone,
              latitude:userinfo.latitude,
              longitude:userinfo.longitude,
              page:page,
              schema:func,
              description:description,
              priority:priority,
              component:component,
              severity:severity
            },
            active:1,
            momento:moment().unix()
          });
          arr.loglist = d;
          arr.logcount = c;
          // this.saveinScreenCast(issueid,id);
          return this.pdb2.put(arr);
        // }
        
      })
      // .then( (configDoc) =>{
      //   // console.log("then",configDoc)
      //   // sweet, here is our configDoc
      // })
      .catch((err) =>{
        // console.log("catch",err)
        // handle any errors
        this.insertAtFirstEntry(id,page,func,description,notes,priority,component,severity);
      });
    }catch(e){
      
    }
  }
  insertAtFirstEntry(id,page,func,description,notes,priority,component,severity){   
    let userinfo = JSON.parse((this.serviceapi.retrieveFromLocal("SISAppUserInfo")).toString());
    let issueid = 'log'+1;
    let doc = {
      _id:id,
      logcount:1,
      loglist:[{
        _id:issueid,
        data:{
          tracker:notes,
          timestamp: new Date(),
          ip:userinfo.ip,
          country:userinfo.country_name,
          city:userinfo.city,
          time_zone:userinfo.time_zone,
          latitude:userinfo.latitude,
          longitude:userinfo.longitude,
          page:page,
          schema:func,
          description:description,
          priority:priority,
          component:component,
          severity:severity
        },
        active:1,
        momento:moment().unix()
      }]
    }
    this.saveFirstEntry(doc);
    // this.saveinScreenCast(issueid,id);
  }
  saveFirstEntry(doc){
    try{
      this.pdb2.put(doc).then(
        d =>{
          // console.log(d,"recorded issued")
        }
      ).catch((e)=>{
        // console.info("inthen:",e)
        if(e.name == "conflict"){
          // console.log("im conflict","call another update")
        }else{
          // console.error("error",e)
        }
      });
    }catch(e){
      
    }
  }

  putErrorInPouch(fun,desc,notes,priority,component,severity){
    // console.log(this.userIP)
    try{
      let id = this.userIP.ip+"-"+this.userIP.city;
      if(id == null || id == "" || id == undefined || !id){
        id = "CAS-Distributor";
      }
      let page = this.router.url;
      let func = fun; 
      let description = desc;
      // console.log(id,page,func,description)
      //serverityy log error warning info sucess
      this.letsIssuing(id,page,func,description,notes,priority,component,severity);
    }catch(e){
      let page = this.router.url;
      let func = fun; 
      let description = desc;
      // console.log(id,page,func,description)
      //serverityy log error warning info sucess
      this.letsIssuing("CAS-Distributor",page,func,description,notes,priority,component,severity); 
    }
  }

  logslist(){
    return new Promise((resolve,reject)=>{
      this.http.get(this.pdb+"_all_docs").subscribe(
        d=>{
          resolve(d)
        },
        e=>{
          reject(e)
        }
      )
    });
  }

  logsforlist(logfor){
    return new Promise((resolve,reject)=>{
      this.http.get(this.pdb+logfor).subscribe(
        d=>{
          resolve(d)
        },
        e=>{
          reject(e)
        }
      )
    });
  }

}
