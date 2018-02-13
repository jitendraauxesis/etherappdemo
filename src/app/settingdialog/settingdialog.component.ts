import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MycryptoService } from '../service/mycrypto.service';
import { CasService } from '../service/cas.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

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
    public router:Router
  ) { }

  ngOnInit() {
    // console.log(this.data.name)
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
      this.snackBar.open("Continuing...",'Undo',{
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
