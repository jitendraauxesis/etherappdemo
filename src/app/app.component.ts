import { Component } from '@angular/core';
import { MycryptoService } from './service/mycrypto.service';
import bluebird from 'bluebird';
import { Router, ActivatedRoute, ParamMap,NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/switchMap'; //to fetch url params
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    public mycryptoService:MycryptoService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ){
    bluebird.config({
        warnings: false
    });
  } 
  ngOnInit(){
    this.mycryptoService.saveToLocalURL("SISNODEURL","http://localhost:3000/");
    this.mycryptoService.saveToLocalURL("SISWEB3URL","https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");
    //"https://ropsten.infura.io/2H9y3HfwB9FOuy0Gqr4m");//"https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");//"http://139.59.213.205:7007");//"http://127.0.0.1:8008");
    // console.log(this.mycryptoService.retrieveFromLocalURL("SISNODEURL"),this.mycryptoService.retrieveFromLocalURL("SISWEB3URL"));


    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .map(() => this.route)
    .map((route) => {
      while (route.firstChild) route = route.firstChild;
      return route;
    })
    .filter((route) => route.outlet === 'primary')
    .mergeMap((route) => route.data)
    .subscribe((event) => {
      // console.log(event['title']);
      this.titleService.setTitle(event['title']);
    });
  }
}
