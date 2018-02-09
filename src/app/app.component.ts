import { Component } from '@angular/core';
import { MycryptoService } from './service/mycrypto.service';
import bluebird from 'bluebird';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    public mycryptoService:MycryptoService,
  ){
    bluebird.config({
        warnings: false
    });
  } 
  ngOnInit(){
    this.mycryptoService.saveToLocalURL("SISNODEURL","http://localhost:3000/");
    this.mycryptoService.saveToLocalURL("SISWEB3URL","http://138.197.111.208:8545");//"https://ropsten.infura.io/2H9y3HfwB9FOuy0Gqr4m");//"https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");//"http://139.59.213.205:7007");//"http://127.0.0.1:8008");
    // console.log(this.mycryptoService.retrieveFromLocalURL("SISNODEURL"),this.mycryptoService.retrieveFromLocalURL("SISWEB3URL"));
  }
}
