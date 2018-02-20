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
export class PouchactivityService {

  pdb2:any;

  constructor(
    public http:Http,
    private route: ActivatedRoute,
    private router: Router,
    public serviceapi:MycryptoService
  ) { 
    this.pdb2 = new PouchDB("http://45.55.211.36:5984/casdistribution-listactivity/");

    this.makeStoredInfo();
  }

  makeStoredInfo(){
    let info = this.serviceapi.retrieveFromLocal("SISAppUserInfo");
    if(info == "" || info == null || !info){

      this.http.get("https://freegeoip.net/json/")
      .subscribe(
        d=>{
          // console.info(d)
          let dt = JSON.parse(JSON.stringify(d));
          let dt2 = JSON.parse(dt._body);
          this.serviceapi.saveToLocal("SISAppUserInfo",dt._body);
          
        },
        e=>{
          this.serviceapi.saveToLocal("SISAppUserInfo",JSON.stringify("Its CASHAA ADDRESS"));          
        }
      )
    }else{
      
    }
  }

  putActivityInPouch(component,fun,desc,notes){
    let id = "CAS-Distributor";
    if(id == null || id == "" || id == undefined || !id){
      id = "Global-User";
    }
    let page = this.router.url;
    let func = fun;
    let description = desc;
    // console.log(id,page,func,description)
    this.letsDoActivity(component,id,page,func,description,notes);
  }

  letsDoActivity(component,id,page,func,description,notes){
    
    
    this.updateIssue(component,id,page,func,description,notes);
  }
  updateIssue(component,id,page,func,description,notes){
    try{
      let userinfo = JSON.parse((this.serviceapi.retrieveFromLocal("SISAppUserInfo")).toString());

      this.pdb2.get(id).then((arr) =>{
        // console.log("then1",arr);

        var list = arr.activitylist;
        var getcount = arr.activitycount;
        
          let d = list; 
          let c = getcount+1;
          let aid ='activity'+c; 
          // d.push(list)
          d.push({
            _id:aid,
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
              component:component
            },
            active:1,
            momento:moment().unix()
          });
          arr.activitylist = d;
          arr.activitycount = c;
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
        this.insertAtFirstEntry(component,id,page,func,description,notes);
      });
    }catch(e){
      
    }
  }
  insertAtFirstEntry(component,id,page,func,description,notes){   
    let userinfo = JSON.parse((this.serviceapi.retrieveFromLocal("SISAppUserInfo")).toString());
    let aid = 'activity'+1;
    let doc = {
      _id:id,
      activitycount:1,
      activitylist:[{
        _id:aid,
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
          component:component
        },
        active:1,
        momento:moment().unix()
      }]
    } 
    this.saveFirstEntry(doc);
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

}
