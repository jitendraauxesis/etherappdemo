import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { MycryptoService } from '../service/mycrypto.service';
import { CasService } from '../service/cas.service';
import { Router } from '@angular/router';
// const ELEMENT_DATA: Element[] = [];
@Component({
  selector: 'app-userhomecsvdetail',
  templateUrl: './userhomecsvdetail.component.html',
  styleUrls: ['./userhomecsvdetail.component.css']
})
export class UserhomecsvdetailComponent implements OnInit {

  displayedColumns:any;
  dataSource:any;

  csvData:any;
  eleData:Element[] = [];

  web3:any;

  fileData:any;

  constructor(
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public router:Router
  ) { 
    this.web3 = this.casService.init();
  }

  ngOnInit() {

    let check = this.mycryptoService.retrieveFromLocal("SISFileUploadContent");
    if(check == null || check == "" || !check){
      this.router.navigateByUrl("/home");
    }else{

      let dt = JSON.parse((this.mycryptoService.retrieveFromLocal("SISFileUploadContent")).toString());
      // console.log(dt,this.csvData,dt.csvData.length)
      this.fileData = dt.filedata.ufile;
      // console.log(this.fileData)
      if(dt.csvData.length == 0){
        this.router.navigateByUrl("/home");
      }else if(this.haveFileError(dt.csvData,this.web3)){
        this.router.navigateByUrl("/home");
      }
      else{

        let details = dt.csvData;
        let rows = [];

        details.forEach((value,key) => {
          // console.log(value,key) 
          rows.push({
            position:(key+1),
            address:value[0],
            tokens:value[1]
          });
        });

        this.eleData = rows;

        this.displayedColumns = ['position', 'address', 'tokens'];//['no', 'address', 'tokens'];
        this.dataSource = new MatTableDataSource<Element>(this.eleData);

        // console.log(this.eleData,this.dataSource)
      }
    }
  }

  haveFileError(csv,web3){//should return 0
    let error = false;
    // csv.forEach((value,key) => {
    let value = csv;
    // console.log(value)
    for(let key=0;key<value.length;key++){  
        // console.log(value[key][0],value.length)
        // console.log(web3.utils.isAddress(value[key][0]),value[key][1])
        if(web3.utils.isAddress(value[key][0]) && (value[key][1]!=0||value[key][1]!="0")){
          // console.log(value,key)
          error = false;
        }else{
          // console.log("error")
          error = true;
          break;
          // return false;
        }
    };
    return error;
  }
  
}


export interface Element {
  // name: string;
  position: number;
  address:number;
  tokens:number;
  // weight: number;
  // symbol: string;
}

// const ELEMENT_DATA: Element[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];