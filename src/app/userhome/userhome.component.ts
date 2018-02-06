import { Component, OnInit } from '@angular/core';

import { FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MycryptoService } from '../service/mycrypto.service';
import { CasService } from '../service/cas.service';
import {MatDialog} from '@angular/material';
import { UserhomemodelComponent } from '../userhomemodel/userhomemodel.component';
import { FileUtilService } from '../interfaces/file-util.service';
import { ConstantsService } from '../interfaces/constants.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent implements OnInit {

  uploadForm:FormGroup;

  @ViewChild('csvfile') csvfile:ElementRef;

  fileContent:any;

  csvRecords = [];
  public ngxloading  = false;
  constructor(
    public formbuilder:FormBuilder,
    public snackBar: MatSnackBar,
    public mycryptoService:MycryptoService,
    public casService:CasService,
    public dialog: MatDialog,
    private _fileUtil: FileUtilService
  ) {  
    this.uploadForm = formbuilder.group({
      ufile:['',[Validators.compose([Validators.required])]]
    }); 
  } 

  ngOnInit() {
    let status = this.casService.createAddressAndWallet();
    if(status == "already"){
      // console.log(status) 
      // this.sendMoney();
    }else{
      // this.sendMoney();
    }

    setTimeout(()=>{
      this.openModal();
    },1000)
    
  }

  sendMoney(){
    let address = this.mycryptoService.retrieveFromLocal("SISUAddress");
    let checkpkey = this.mycryptoService.retrieveFromLocal("SISUPrivateKey");
    console.log(address,checkpkey,this.casService.init())
    let web3 = this.casService.init();
    web3.eth.getAccounts().then(
      dd=>{
        // console.log(dd,address)
        let send_address = address;
        let amnt = "5";
        web3.eth.personal.unlockAccount(dd[0], "asd", 180) 
        .then(
          d=>{
            // console.log(d)
            var dt = {
              from:dd[0], 
              to: send_address,  
              value: web3.utils.toHex(web3.utils.toWei(amnt))
            };
            // console.log(dt)
            web3.eth.sendTransaction(dt,(error,hash)=>{
              // console.log(error,hash)
              if(error){
                console.log("send ether failed due to:",error)
              }else{
                console.log("hash,",hash)
              }
            });
          },
          e=>{
            console.log(e)
          }
        );
        
      },
      ee=>{
        console.log("failed last")
      }
    );
  }

  onFileChange(event) {
    console.log(event)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      // console.log(file,event)
      if(file.size > 2000000){
        // this.failmsg("File size can not be greater than 1 Mb");
        this.uploadForm.get('ufile').setValue(null);
        this.csvfile.nativeElement.value = "";
        return false;
      }else{
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.fileContent = reader.result;
          console.log(file,this.uploadForm,JSON.stringify({data:reader.result}))
          this.uploadForm.get('ufile').setValue({
            filename: file.name,
            filetype: file.type,
            filesize: file.size,
            value: reader.result.split(',')[1]
          }) 
        };
      }
    }
  }

  fileChangeListener($event): void {
 
    var text = [];
    var files = $event.srcElement.files;
 
    if(ConstantsService.validateHeaderAndRecordLengthFlag){
      if(!this._fileUtil.isCSVFile(files[0])){
        // alert("Please import valid .csv file.");
        this.snackBar.open("Please import valid .csv file.",'Undo',{
          duration:2000
        });
        this.fileReset();
      }
    }
 
    var input = $event.target;
    var file = input.files[0];
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
 
    reader.onload = (data) => {
      let csvData = reader.result;
      this.fileContent = csvData;
      let csvRecordsArray = csvData.split(/\r\n|\n/);
 
      var headerLength = -1;
      if(ConstantsService.isHeaderPresentFlag){
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, ConstantsService.tokenDelimeter);
        headerLength = headersRow.length; 
      }
       
      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, ConstantsService.validateHeaderAndRecordLengthFlag, ConstantsService.tokenDelimeter);
      
      
      // not available
      if(this.csvRecords == null){
        //If control reached here it means csv file contains error, reset file.
        this.fileReset();
      }
      else{
        //file content available    
        // console.log("this.csvRecords",this.csvRecords)
        this.uploadForm.get('ufile').setValue({
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
          value: reader.result,
          lastmodified:file.lastModified,
          lastmodifieddate:file.lastModifiedDate
        }) 
        // console.log("ok")
      }    
    }
 
    reader.onerror = () => {
      // alert('Unable to read ' + input.files[0]);
      this.snackBar.open('Unable to read ' + input.files[0],'Undo',{
        duration:2000
      });
    };
  };
 
  fileReset(){
    this.csvfile.nativeElement.value = "";
    this.csvRecords = [];
  }
 
  haveFileError(csv,web3){//should return 0
    let error = 0;
    // csv.forEach((value,key) => {
    let value = csv;
    for(let key=0;key<value.length;key++){  
        // console.log(value[key][0],value.length)
        // console.log(web3.utils.isAddress(value[key][0]),value[key][1])
        if(web3.utils.isAddress(value[key][0]) && (value[key][1]!=0||value[key][1]!="0")){
          // console.log(value,key)
          error = 0;
        }else{
          // console.log("error")
          error = 1;
          break;
          // return false;
        }
    };
    return error;
  }

  uploadcsv(){
    if(this.uploadForm.valid){
      // console.log(this.uploadForm.value)
      this.ngxloading  = true;
      let web3 = this.casService.init();

      let csv = this.csvRecords;
      // console.log(csv);
      let a = this.haveFileError(csv,web3);
      // console.log(a,"a")
      if(a==1){
        this.ngxloading  = false;
        this.snackBar.open('The file content is wrong. Correct it.','Undo',{
          duration:3000
        }).afterDismissed().subscribe(d=>{

        });
      }else{
        
        this.casService.returnCompiledContract()
        .then(
          d=>{
            console.log(d)
            this.ngxloading  = false;
            this.snackBar.open('File Uploaded Successfully','',{
              duration:4000
            }).afterOpened().subscribe((d)=>{
              let data = {
                filedata:this.uploadForm.value,
                fileContent:this.fileContent,
                csvData:this.csvRecords
              }
              this.mycryptoService.saveToLocal("SISFileUploadContent",JSON.stringify(data));
              this.openModal();
              // console.log(data,JSON.stringify(this.mycryptoService.retrieveFromLocal("SISFileUploadContent")));
            });
          },
          e=>{
            this.ngxloading  = false;
            this.snackBar.open('File unable to upload','Undo',{
              duration:2000
            });
          }
        );
      }
      
    }else{
      // console.log("Invalid file")
      this.snackBar.open('No file choosen or Invalid file','Undo',{
        duration:1000
      });
    }
  }

  openModal(){
    const dialogRef = this.dialog.open(UserhomemodelComponent, {
      height: '450px',
      width:'500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
