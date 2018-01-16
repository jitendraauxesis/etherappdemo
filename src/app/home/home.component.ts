import { Component, OnInit } from '@angular/core';

import {MatSnackBar} from '@angular/material';
import { WelcomeComponent } from '../welcome/welcome.component';
import { MywebService } from '../service/myweb.service';
import { MycryptoService } from '../service/mycrypto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public snackBar: MatSnackBar,
    public mywebService: MywebService,
    public mycryptoService:MycryptoService
  ) { }

  ngOnInit() {
    // this.mywebService.createAddressAndWallet();
  }

  openSnackBar() {
    // this.snackBar.openFromComponent(WelcomeComponent, {
    //   duration: 1000,
    // });

    this.snackBar.open('Ok Fine MD','Undo',{
      duration:1000
    });
  }

  clearStorage(){
    this.mycryptoService.clearStorage();
  }

  makeAddress(){
    this.mywebService.createAddressAndWallet();
  }

  deployContract(){
    this.mywebService.deployContract();
  }
  
}
