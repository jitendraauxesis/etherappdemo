import { Component, OnInit } from '@angular/core';
import { CasService } from '../service/cas.service';
import { MatSnackBar } from '@angular/material';
import { MycryptoService } from '../service/mycrypto.service';

@Component({
  selector: 'app-userhomemodel',
  templateUrl: './userhomemodel.component.html',
  styleUrls: ['./userhomemodel.component.css']
})
export class UserhomemodelComponent implements OnInit {
  
  countTXAddresses:number = 0;
  countTXTokens:number = 0;
  totalTXTokens:any = 0;

  initialView:number = 0;

  constructor(
    public casService:CasService,
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
  ) { 

  }

  ngOnInit() {
    let csvFileContent = JSON.parse((this.mycryptoService.retrieveFromLocal("SISFileUploadContent")).toString());
    // console.log(csvFileContent);

    let details = csvFileContent.csvData;
    let rows = [];
    
    details.forEach((value,key) => {
      // console.log(value,key)
      this.countTXAddresses =  key+1; 
      this.countTXTokens = key+1;
      rows.push({
        position:(key+1),
        address:value[0],
        tokens:value[1]
      });
      this.totalTXTokens = this.totalTXTokens+parseInt(value[1]);
    });

    // console.log(details,this.countTXTokens,this.countTXAddresses)
  }

  next(arg){
    this.initialView = 1;

  }

}
