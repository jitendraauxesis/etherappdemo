# Etherapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

# CAS Tokens 
## Main 
 
### Pages Used 
1 Userhomecomponent __ 
2 Userhomecsvdetailcomponent __
3 Transactionhistorycomponent __
4 Userhomemodelcomponent __
5 Userhomesinglemodelcomponent __
6 Historydetailcomponent __
7 Settingscomponent __
8 Settingsdialogcomponent __
 
### Provider used 
1 Service/cas.service.ts --> CasService <br />
2 Service/mycrypto.service.ts --> MycryptoService <br />
3 interfaces/constants.service.ts --> ConstantsService <br />
4 interfaces/file-util.service.ts --> FileUtilService <br />
 
 
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
 
Layout/navbarComponent: 
1 upload() 
Is the method for navigating home url. 
2 csvdetail() 
Navigating csv/detail router. 
3 history() 
Navigating history router. 
4 settings() 
Navigating settings page not used. 
 
Historydetailcomponent 
1 ngOnInit 
Load history transaction id as paramater and identify transactiov view detail either single or multiple. 
2 incr 
To increment multiple transaction row id  
3 convertToDate 
Convert date to human radable 
4 backlist 
Navigate history page 
 
 
Settingscomponent 
1 constructor 
Initialize form data and validation 
2 letAuth 
Open default the modal to update setting page 
3 ngOnInit 
Retrieve global variables and auth modal 
4 submit 
To change global values 
 
 
Settingsdialogcomponent 
1 check 
Is used to response auth modal for setting page 
 
 
 
Providers: 
1 FileUtilService: 
Used to validate a csv file. 
2 ConstantsService: 
Initializing the static variables for csv file 
3 CasService: 
A instance creation of web3 provider using some method to access a transaction and all. 
4 MycryptoService: 
Provider used to generate app holder secret and storing and retireving method from local. 
5 MywebService: 
Not used. 
 
 
App.component.ts 
In ngOnInit() method used to set node url that is not used and web3url for ethereum network using isStored variable and using different title for every page. 
App.routes.ts 
Define the app routers or urls and titles. 
App.module.ts 
All the component and provider services declaration in ngModule. 
 
Directory Assets/ 
Lib/image used images in app. 
 
Dependent npm packages used in app are placed in package.json file that is: 
"dependencies": { 
"@angular/animations": "^5.2.0", 
"@angular/cdk": "^5.0.4", 
"@angular/common": "^5.0.0", 
"@angular/compiler": "^5.0.0", 
"@angular/core": "^5.0.0", 
"@angular/forms": "^5.0.0", 
"@angular/http": "^5.0.0", 
"@angular/material": "^5.0.4", 
"@angular/platform-browser": "^5.0.0", 
"@angular/platform-browser-dynamic": "^5.0.0", 
"@angular/router": "^5.0.0", 
"axios": "^0.17.1", 
"bitcoinjs-lib": "^3.3.2", 
"browser-solc": "git+https://github.com/ericxtang/browser-solc.git", 
"buffer": "^5.0.8", 
"core-js": "^2.4.1", 
"crypto-js": "^3.1.9-1", 
"ethereumjs-tx": "^1.3.3", 
"ethers": "^2.2.0", 
"ethjs": "^0.3.3", 
"express": "^4.16.2", 
"filereader": "^0.10.3", 
"fs": "0.0.1-security", 
"hammerjs": "^2.0.8", 
"js-sha512": "^0.7.1", 
"lodash": "^4.17.5", 
"material-design-icons": "^3.0.1", 
"moment": "^2.20.1", 
"ngx-loading": "^1.0.14", 
"ngx-webstorage": "^2.0.1", 
"rxjs": "^5.5.2", 
"secure-random": "^1.1.1", 
"solc": "^0.4.19", 
"web3": "^1.0.0-beta.28", 
"zone.js": "^0.8.14" 
}, 
 
 
 
 
Page Break
 
Local  
1) ethereum network started using 
geth --identity "Node2" --rpc --rpcport "8008" --rpccorsdomain "*"  --datadir "/home/auxesis/Documents/ethereum" --port "30304" --nodiscover --rpcapi  "db,eth,net,web3,solc,personal,admin,debug,shh,txpool,solcjs" --networkid 1999 console 
2) running node server for ethereum local 
3) compile from node server and deploy in project 
4) used sendether method to send money to current address in userhome 
5)  
 