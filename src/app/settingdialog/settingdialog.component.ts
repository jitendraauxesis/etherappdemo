import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MycryptoService } from '../service/mycrypto.service';
import { CasService } from '../service/cas.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { PouchactivityService } from '../service/pouchactivity.service';
import { PouchlogsService } from '../service/pouchlogs.service';
@Component({
  selector: 'app-settingdialog',
  templateUrl: './settingdialog.component.html',
  styleUrls: ['./settingdialog.component.css']
})
export class SettingdialogComponent implements OnInit {

  name:any;

  constructor(
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public dialogRef: MatDialogRef<SettingdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router:Router,
    public activityServ:PouchactivityService,
    public logServ:PouchlogsService
  ) { }

  ngOnInit() {
    // console.log(this.data.name)
    // this.dialogRef.afterClosed().subscribe(result=>{
    //   console.log(result)
    //     if(result  == true){
    //       // console.log(result)
    //     }else 
    //     if(result == undefined || result == null || result == ""){
    //       this.router.navigateByUrl("/home");
    //       // console.log(result)
    //     } 
    //     else{
    //       this.router.navigateByUrl("/home");
    //     }
    // })
  }

  check(){
    if(this.name == null || this.name == ""){
      this.dialogRef.close();
      this.router.navigate(['home'])
      this.snackBar.open("Unauthorize",'',{
        duration:2000
      });
    }else if(this.name == this.data.name){
      //continue
      // this.dialogRef.afterClosed().switchMap(result);
      // this.dialogRef.close(); 
      this.dialogRef.afterClosed().subscribe(result=>{
        console.log("result",result)
          if(result  == true){
            this.activityServ.putActivityInPouch("SettingdialogComponent","check()","Viewed a secret dialog to open setting page.","Valid user");

            // console.log(result)
          }else if(result == undefined || result == null || result == ""){
            this.router.navigateByUrl("/home");
            // console.log(result)
          } 
          else{
            this.router.navigateByUrl("/home");
          }
      })
      // this.dialogRef.afterClosed().subscribe(result => true);
      this.snackBar.open("Continuing...",'',{
        duration:2000
      });
    }else{
      this.dialogRef.close();
      this.router.navigate(['home'])
      this.snackBar.open("Unauthorize.",'',{
        duration:2000
      });
    }
  }
}
