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
export class PouchlogsService {

  pdb2:any;
  checkAppArr:any;

  constructor(
    public http:Http,
    public serviceapi:MycryptoService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.pdb2 = new PouchDB("http://45.55.211.36:5984/casdistribution-list/");
    this.storeIP();
  }

  storeIP(){
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

  letsIssuing(id,page,func,description,notes,priority){
    this.updateIssue(id,page,func,description,notes,priority);
  }
  updateIssue(id,page,func,description,notes,priority){

    try{
      let userinfo = JSON.parse((this.serviceapi.retrieveFromLocal("SISAppUserInfo")).toString());

      this.pdb2.get(id).then((arr) =>{
        // console.log("then1",arr);

        var list = arr.issuelist;
        var getcount = arr.issuescount;
        
          let d = list;
          let c = getcount+1;
          let issueid ='issue'+c; 
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
              priority:priority
            },
            active:1,
            momento:moment().unix()
          });
          arr.issuelist = d;
          arr.issuescount = c;
          this.saveinScreenCast(issueid,id);
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
        this.insertAtFirstEntry(id,page,func,description,notes,priority);
      });
    }catch(e){
      
    }
  }
  insertAtFirstEntry(id,page,func,description,notes,priority){   
    let userinfo = JSON.parse((this.serviceapi.retrieveFromLocal("SISAppUserInfo")).toString());
    let issueid = 'issue'+1;
    let doc = {
      _id:id,
      issuescount:1,
      issuelist:[{
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
          priority:priority
        },
        active:1,
        momento:moment().unix()
      }]
    }
    this.saveFirstEntry(doc);
    this.saveinScreenCast(issueid,id);
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

  saveinScreenCast(issueid,id){
    try{
      let castDB = new PouchDB("http://45.55.211.36:5984/casdistribution-listissuesscreen/");
      html2canvas(document.body,{logging:false}).then((canvas)=>{
        // console.log(canvas);

        var getImage = canvas.toDataURL(); // default is png 
        // console.log(getImage)

        castDB.put({
          _id:id+'-'+issueid,
          email:id,
          key:issueid,
          issueid:issueid,
          screen:getImage,
          active:1,
        },(err,result)=>{
          if(err){
            // console.log("Screen not Captured")
          }else{
            // console.log("ScreenCaptured result:",result)
          }
        })
        .then(d=>{
          // console.log("ScreenCaptured:",d)
        });
      })
    }catch(e){
      
    }
  }

  putErrorInPouch(fun,desc,notes,priority){
    let id = "CAS-Distributor";
    if(id == null || id == "" || id == undefined || !id){
      id = "Global-User";
    }
    let page = this.router.url;
    let func = fun;
    let description = desc;
    // console.log(id,page,func,description)
    this.letsIssuing(id,page,func,description,notes,priority);
  }
}
