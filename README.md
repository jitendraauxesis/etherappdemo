# Etherapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

# CAS Tokens 
## Main 
 
### Pages Used 
1 Userhomecomponent <br /> 
2 Userhomecsvdetailcomponent <br />
3 Transactionhistorycomponent <br />
4 Userhomemodelcomponent <br />
5 Userhomesinglemodelcomponent <br />
6 Historydetailcomponent <br />
7 Settingscomponent <br />
8 Settingsdialogcomponent <br />
 
### Provider used 
1 Service/cas.service.ts --> CasService <br />
2 Service/mycrypto.service.ts --> MycryptoService <br />
3 interfaces/constants.service.ts --> ConstantsService <br />
4 interfaces/file-util.service.ts --> FileUtilService <br />
5 service/pouchactivity.service.ts --> PouchactivityService <br />
6 service/pouchlogs.service.ts --> PouchlogService <br />
 
## Userhomecomponent: 
***
1 Used 2 div element for multiple and single token transaction  <br />
    2 in ngOnInit used 
this.contractDetails():  <br />
Used for saving contract abi bytecode and full contract details. Previously used to deploy contract and save contract address. <br />
         this.saveNewDetail():  <br />
Used to save contract address that defined in etherscan.io 
& 
this.casService.createAddressAndWallet() 
Used to save address and private key of app holder. <br />
3 panelbtn() <br />
Used to change view accordingly multiple or single <br />
4 sendMoney() <br />
Example method to check and transfer money using web3provider. Not used in production. <br />
5 onFileChange() <br />
On Change file response for blob. Not used. <br />
6 fileChangeListener() <br />
On Change file response for csv using two providers ConstantsService and FileUtilService. And taking response in scope variable this.csvRecords <br />
7 fileReset() <br />
To reset file input box and scope variable csvRecords <br />
8 haveFileError() <br />
Is the method used for checking a valid address or not in csv that uploaded. Validating address with web3. <br />
9 uploadcsv() <br />
On form submit validating address and csv file. And then call calculatingFee() <br />
10 openModal() <br />
Opening multiple transaction view or modal by userhomemodelcomponent. <br />
11 calculatingFee() <br />
Call for viewing fee balance and other details in  modal. If are all valid and returned. <br />
12 singlenext() <br />
Is the method to open token transaction single modal and storing fee balance etc detail, and open openModalForSingle() by usehomesinglemodelcomponent. <br />
13 openModalForSingle() <br />
Opne single token transaction model <br />
***

## Userhomemodelcomponent: 
***
1 ngOnInit <br />
Retrieving all the modal details in csv detail. <br />
2 next() <br />
Is the method to change modal window <br />
3 validate() <br />
Just to open snackbar to show csv is valid <br />
4 callsubmit() <br />
A function to transfer tokens to csv addresses using a promise method sendTokens(). And if successful  response saving the records using appendToRECORDS() <br />
5 transferTokens() & ngDoCheck() <br />
Not used <br />
6 sendTokens() <br />
A promise function to resolve successful token transfer using web3provider. <br />
7 appendToRECORDS() <br />
Used to save previous/recent transaction details <br />
8 download() <br />
Is the method used for downloading the file with transactionHash by csv type or json type. <br />
9 downloadUri() <br />
Intergrated for download() method to download a file. <br />
***

## UserhomesinglemodelComponent: 
***
1 constructor() <br />
Used to initialize web3 scope variable. <br />
2 ngOnInit() <br />
Retrieving all necessary detail for single token transfer to able to view in modal. <br />
3 showmsg() <br />
Validator masseges. <br />
4 next() <br />
Changing next view detail <br />
5 callsubmit() <br />
A function for single transaction using sendTokens() promise. <br />
6 sendTokens() <br />
Promise method to resolve successful transfer. And saving the transaction history in same in local if resolve.  <br />
7 download() <br />
A method to download a transaction receipt in csv and json. <br />
8 downloadUri() <br />
Intergrated for download() method to download a file. <br />
***

## UserhomecsvdetailComponent: 
***
1 constructor <br />
Initializing web3 instance <br />
2 ngOnInit() <br />
Retrieving recent uploaded csv detail. <br />
3 haveFileError() <br />
Validating csv stored file. <br />
4 interface Element <br />
Declaring Element variable for data table for csv file. <br />
*** 
 
## TransactionhistoryComponent: 
***
1 ngOnInit() <br />
To check list is available or not using local storage. <br />
2 convertToDate() <br />
Convert timestamp to human readable <br />
3 download() <br />
To download a file using csv and json. <br />
4 downloadUri() <br />
Integrated with download() method <br />
*** 
 
## Layout/navbarComponent: 
***
1 upload() <br />
Is the method for navigating home url. <br />
2 csvdetail() <br />
Navigating csv/detail router. <br />
3 history() <br />
Navigating history router. <br />
4 settings() <br />
Navigating settings page not used. <br />
***

## Historydetailcomponent 
***
1 ngOnInit <br />
Load history transaction id as paramater and identify transactiov view detail either single or multiple. <br />
2 incr <br />
To increment multiple transaction row id  <br />
3 convertToDate <br />
Convert date to human radable <br />
4 backlist <br />
Navigate history page <br />
*** 
 
## Settingscomponent 
***
1 constructor <br />
Initialize form data and validation <br />
2 letAuth <br />
Open default the modal to update setting page <br />
3 ngOnInit <br />
Retrieve global variables and auth modal <br />
4 submit <br />
To change global values <br />
*** 
 
## Settingsdialogcomponent 
***
1 check <br />
Is used to response auth modal for setting page <br />
*** 
 
 
## Providers: 
***
1 FileUtilService: <br />
Used to validate a csv file. <br />
2 ConstantsService: <br />
Initializing the static variables for csv file <br />
3 CasService: <br />
A instance creation of web3 provider using some method to access a transaction and all. <br />
4 MycryptoService: <br />
Provider used to generate app holder secret and storing and retireving method from local. <br />
5 MywebService: <br />
Not used. <br />
6 PouchactivityService: <br />
Used for application activity by user end.  <br />
7 PouchlogsService: <br />
Provider used for logging errors activity from application. <br />
*** 

*** 
### App.component.ts 
In ngOnInit() method used to set node url that is not used and web3url for ethereum network using isStored variable and using different title for every page. <br />
### App.routes.ts 
Define the app routers or urls and titles. <br />
### App.module.ts 
All the component and provider services declaration in ngModule. <br />
***

## Directory Assets/ 
Lib/image used images in app. <br />
 
## Dependent npm packages used in app are placed in package.json file that is: 
"dependencies": { <br />
    "@angular/animations": "^5.2.0", <br />
    "@angular/cdk": "^5.0.4", <br />
    "@angular/common": "^5.0.0", <br />
    "@angular/compiler": "^5.0.0", <br />
    "@angular/core": "^5.0.0", <br />
    "@angular/forms": "^5.0.0", <br />
    "@angular/http": "^5.0.0", <br />
    "@angular/material": "^5.0.4", <br />
    "@angular/platform-browser": "^5.0.0", <br />
    "@angular/platform-browser-dynamic": "^5.0.0", <br />
    "@angular/router": "^5.0.0", <br />
    "axios": "^0.17.1", <br />
    "bitcoinjs-lib": "^3.3.2",<br /> 
    "browser-solc": "git+https://github.com/ericxtang/browser-solc.git", <br />
    "buffer": "^5.0.8", <br />
    "core-js": "^2.4.1", <br />
    "crypto-js": "^3.1.9-1", <br />
    "ethereumjs-tx": "^1.3.3", <br />
    "ethers": "^2.2.0", <br />
    "ethjs": "^0.3.3", <br />
    "express": "^4.16.2", <br />
    "filereader": "^0.10.3", <br />
    "fs": "0.0.1-security", <br />
    "hammerjs": "^2.0.8", <br />
    "js-sha512": "^0.7.1", <br />
    "lodash": "^4.17.5", <br />
    "material-design-icons": "^3.0.1", <br />
    "moment": "^2.20.1", <br />
    "ngx-loading": "^1.0.14", <br />
    "ngx-webstorage": "^2.0.1", <br />
    "rxjs": "^5.5.2", <br />
    "secure-random": "^1.1.1", <br />
    "solc": "^0.4.19", <br />
    "web3": "^1.0.0-beta.28", <br />
    "zone.js": "^0.8.14" <br />
}, <br />
 
 
 
 
 
## Local  
1) ethereum network started using <br />
geth --identity "Node2" --rpc --rpcport "8008" --rpccorsdomain "*"  --datadir "/home/auxesis/Documents/ethereum" --port "30304" --nodiscover --rpcapi  "db,eth,net,web3,solc,personal,admin,debug,shh,txpool,solcjs" --networkid 1999 console <br />
2) running node server for ethereum local <br />
3) compile from node server and deploy in project <br />
4) used sendether method to send money to current address in userhome <br />
5)  <br />
 