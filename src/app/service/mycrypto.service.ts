import { Injectable } from '@angular/core';

import { LocalStorageService , SessionStorageService } from 'ngx-webstorage';
import * as CryptJS from 'crypto-js';
import sha256 from 'js-sha512';

@Injectable()
export class MycryptoService {

  //mainnet
  // web3url:any = "http://159.89.14.24:8545";
  // contractAddress:any = "0xe8780B48bdb05F928697A5e8155f672ED91462F7";
  // localAddress:any = '0xcD0f4B8aC1079E894394448880B90e23d1a7C72e';
  // localPKey:any = '0xbff6ee37dd35f9adc1bb26c0dce1149468cf70f130393f2376c9ef41d0e6fa32';
  viewAddress:any = 'https://etherscan.io/address/';
  viewHash:any = 'https://etherscan.io/tx/';
  angularnodeURL:any = 'http://localhost:3000/';
  abi:any = [{"constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "approve", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "transferFrom", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "burnAmount", "type": "uint256"} ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "value", "type": "uint256"} ], "name": "upgrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"} ], "name": "setTokenInformation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "upgradeAgent", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [], "name": "releaseTokenTransfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "upgradeMaster", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_subtractedValue", "type": "uint256"} ], "name": "decreaseApproval", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "releaseFinalizationDate", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"} ], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getUpgradeState", "outputs": [{"name": "", "type": "uint8"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "released", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "canUpgrade", "outputs": [{"name": "", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"} ], "name": "transfer", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalUpgraded", "outputs": [{"name": "", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_addedValue", "type": "uint256"} ], "name": "increaseApproval", "outputs": [{"name": "success", "type": "bool"} ], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "agent", "type": "address"} ], "name": "setUpgradeAgent", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"} ], "name": "allowance", "outputs": [{"name": "remaining", "type": "uint256"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "isToken", "outputs": [{"name": "weAre", "type": "bool"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "BURN_ADDRESS", "outputs": [{"name": "", "type": "address"} ], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "master", "type": "address"} ], "name": "setUpgradeMaster", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"name": "_owner", "type": "address"}, {"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"}, {"name": "_totalSupply", "type": "uint256"}, {"name": "_decimals", "type": "uint256"}, {"name": "_releaseFinalizationDate", "type": "uint256"} ], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "newName", "type": "string"}, {"indexed": false, "name": "newSymbol", "type": "string"} ], "name": "UpdatedTokenInformation", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {"indexed": true, "name": "_to", "type": "address"}, {"indexed": false, "name": "_value", "type": "uint256"} ], "name": "Upgrade", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "agent", "type": "address"} ], "name": "UpgradeAgentSet", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "name": "burner", "type": "address"}, {"indexed": false, "name": "burnedAmount", "type": "uint256"} ], "name": "Burned", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"} ], "name": "Approval", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"} ], "name": "Transfer", "type": "event"} ];
  bytecode:any = '60606040526009805460ff1916905534156200001a57600080fd5b604051620013c2380380620013c28339810160405280805191906020018051820191906020018051820191906020018051919060200180519190602001805160038054600160a060020a031916600160a060020a038a161790559150600690508580516200008d929160200190620000d1565b506007848051620000a3929160200190620000d1565b506000838155600892909255600160a060020a039095168152600160205260409020555050600a5562000176565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200011457805160ff191683800117855562000144565b8280016001018555821562000144579182015b828111156200014457825182559160200191906001019062000127565b506200015292915062000156565b5090565b6200017391905b808211156200015257600081556001016200015d565b90565b61123c80620001866000396000f30060606040526004361061013a5763ffffffff60e060020a60003504166306fdde03811461013f578063095ea7b3146101c957806318160ddd146101ff57806323b872dd14610224578063313ce5671461024c57806342966c681461025f57806345977d03146102775780634eee966f1461028d5780635de4ccb0146103205780635f412d4f1461034f578063600440cb1461036257806366188463146103755780636748a0c61461039757806370a08231146103aa5780638444b391146103c957806395d89b411461040057806396132521146104135780639738968c14610426578063a9059cbb14610439578063c752ff621461045b578063d73dd6231461046e578063d7e7088a14610490578063dd62ed3e146104af578063eefa597b14610426578063fccc2813146104d4578063ffeb7d75146104e7575b600080fd5b341561014a57600080fd5b610152610506565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561018e578082015183820152602001610176565b50505050905090810190601f1680156101bb5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101d457600080fd5b6101eb600160a060020a03600435166024356105a4565b604051901515815260200160405180910390f35b341561020a57600080fd5b610212610610565b60405190815260200160405180910390f35b341561022f57600080fd5b6101eb600160a060020a0360043581169060243516604435610616565b341561025757600080fd5b610212610740565b341561026a57600080fd5b610275600435610746565b005b341561028257600080fd5b610275600435610821565b341561029857600080fd5b61027560046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061098a95505050505050565b341561032b57600080fd5b610333610b3d565b604051600160a060020a03909116815260200160405180910390f35b341561035a57600080fd5b610275610b4c565b341561036d57600080fd5b610333610b76565b341561038057600080fd5b6101eb600160a060020a0360043516602435610b85565b34156103a257600080fd5b610212610c7f565b34156103b557600080fd5b610212600160a060020a0360043516610c85565b34156103d457600080fd5b6103dc610ca0565b604051808260048111156103ec57fe5b60ff16815260200191505060405180910390f35b341561040b57600080fd5b610152610cea565b341561041e57600080fd5b6101eb610d55565b341561043157600080fd5b6101eb610d5e565b341561044457600080fd5b6101eb600160a060020a0360043516602435610d63565b341561046657600080fd5b610212610d91565b341561047957600080fd5b6101eb600160a060020a0360043516602435610d97565b341561049b57600080fd5b610275600160a060020a0360043516610e3b565b34156104ba57600080fd5b610212600160a060020a0360043581169060243516610ff2565b34156104df57600080fd5b61033361101d565b34156104f257600080fd5b610275600160a060020a0360043516611022565b60068054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561059c5780601f106105715761010080835404028352916020019161059c565b820191906000526020600020905b81548152906001019060200180831161057f57829003601f168201915b505050505081565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a350600192915050565b60005481565b600080600160a060020a038416151561062e57600080fd5b50600160a060020a03808516600081815260026020908152604080832033909516835293815283822054928252600190529190912054610674908463ffffffff61108116565b600160a060020a0380871660009081526001602052604080822093909355908616815220546106a9908463ffffffff61109316565b600160a060020a0385166000908152600160205260409020556106d2818463ffffffff61108116565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3506001949350505050565b60085481565b33600160a060020a03811660009081526001602052604090205461076a9083611081565b600160a060020a03821660009081526001602052604081209190915554610797908363ffffffff61108116565b6000557f696de425f79f4a40bc6d2122ca50507f0efbeabbff86a84871b7196ab8ea8df78183604051600160a060020a03909216825260208201526040908101905180910390a16000600160a060020a0382167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405190815260200160405180910390a35050565b600061082b610ca0565b9050600381600481111561083b57fe5b14806108525750600481600481111561085057fe5b145b151561085d57600080fd5b81151561086957600080fd5b600160a060020a033316600090815260016020526040902054610892908363ffffffff61108116565b600160a060020a033316600090815260016020526040812091909155546108bf908363ffffffff61108116565b6000556005546108d5908363ffffffff61109316565b600555600454600160a060020a031663753e88e5338460405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401600060405180830381600087803b151561092e57600080fd5b6102c65a03f1151561093f57600080fd5b5050600454600160a060020a03908116915033167f7e5c344a8141a805725cb476f76c6953b842222b967edd1f78ddb6e8b3f397ac8460405190815260200160405180910390a35050565b60035433600160a060020a039081169116146109a557600080fd5b6000600680546001816001161561010002031660029004905011806109e0575060006007805460018160011615610100020316600290049050115b156109ea57600080fd5b60068280516109fd929160200190611178565b506007818051610a11929160200190611178565b507fd131ab1e6f279deea74e13a18477e13e2107deb6dc8ae955648948be5841fb4660066007604051604080825283546002600019610100600184161502019091160490820181905281906020820190606083019086908015610ab55780601f10610a8a57610100808354040283529160200191610ab5565b820191906000526020600020905b815481529060010190602001808311610a9857829003601f168201915b5050838103825284546002600019610100600184161502019091160480825260209091019085908015610b295780601f10610afe57610100808354040283529160200191610b29565b820191906000526020600020905b815481529060010190602001808311610b0c57829003601f168201915b505094505050505060405180910390a15050565b600454600160a060020a031681565b60035433600160a060020a03908116911614610b6757600080fd5b6009805460ff19166001179055565b600354600160a060020a031681565b600160a060020a03338116600090815260026020908152604080832093861683529290529081205480831115610be257600160a060020a033381166000908152600260209081526040808320938816835292905290812055610c19565b610bf2818463ffffffff61108116565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a35060019392505050565b600a5481565b600160a060020a031660009081526001602052604090205490565b6000610caa610d5e565b1515610cb857506001610ce7565b600454600160a060020a03161515610cd257506002610ce7565b6005541515610ce357506003610ce7565b5060045b90565b60078054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561059c5780601f106105715761010080835404028352916020019161059c565b60095460ff1681565b600190565b6000600a54421115610d805760095460ff161515610d8057600080fd5b610d8a83836110a2565b9392505050565b60055481565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054610dcf908363ffffffff61109316565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a350600192915050565b610e43610d5e565b1515610e4e57600080fd5b600160a060020a0381161515610e6357600080fd5b60035433600160a060020a03908116911614610e7e57600080fd5b6004610e88610ca0565b6004811115610e9357fe5b1415610e9e57600080fd5b6004805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038381169190911791829055166361d3d7a66000604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b1515610f0957600080fd5b6102c65a03f11515610f1a57600080fd5b505050604051805190501515610f2f57600080fd5b600080546004549091600160a060020a0390911690634b2ba0dd90604051602001526040518163ffffffff1660e060020a028152600401602060405180830381600087803b1515610f7f57600080fd5b6102c65a03f11515610f9057600080fd5b50505060405180519050141515610fa657600080fd5b6004547f7845d5aa74cc410e35571258d954f23b82276e160fe8c188fa80566580f279cc90600160a060020a0316604051600160a060020a03909116815260200160405180910390a150565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b600081565b600160a060020a038116151561103757600080fd5b60035433600160a060020a0390811691161461105257600080fd5b6003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60008282111561108d57fe5b50900390565b600082820183811015610d8a57fe5b6000600160a060020a03831615156110b957600080fd5b600160a060020a0333166000908152600160205260409020546110e2908363ffffffff61108116565b600160a060020a033381166000908152600160205260408082209390935590851681522054611117908363ffffffff61109316565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a350600192915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106111b957805160ff19168380011785556111e6565b828001600101855582156111e6579182015b828111156111e65782518255916020019190600101906111cb565b506111f29291506111f6565b5090565b610ce791905b808211156111f257600081556001016111fc5600a165627a7a723058200e73aee9c0e4807afbe42945ee1829a60d3a222714b9b7dc2ea205c5695027d80029';

  //ropsten
  web3url:any = "http://138.197.111.208:8545";//"https://ropsten.infura.io/2H9y3HfwB9FOuy0Gqr4m";
  contractAddress:any = "0x11dc5a650e1e2a32c336fa73439e7cc035976c06";
  localAddress:any = '0xcD0f4B8aC1079E894394448880B90e23d1a7C72e';
  localPKey:any = '0xbff6ee37dd35f9adc1bb26c0dce1149468cf70f130393f2376c9ef41d0e6fa32';

  // localAddress:any = '0x24775D755d8d8C48D917F86Efcc36eb0d59b2aD9';
  // localPKey:any = '0x42c10ce7f8945afd9958eeb6666502360e9a7c8388e6846ae1891f7f467c6386';


  constructor(
    private localStorageService:LocalStorageService,
    private sessionStorageService:SessionStorageService
  ) { 
    this.InitKeySet();
  }

  InitKeySet(){
    let chk = this.InitKeyGet();
    if( chk == "" || chk == undefined || chk == null){
      console.log("im in")
      let key = "This is just a demo "+new Date(); 
      let val = sha256(key);
      this.localStorageService.store("SISKeystore",val);

      //global vals
      this.saveToLocalURL("SISNODEURL",this.angularnodeURL);
      this.saveToLocalURL("SISWEB3URL",this.web3url);//"https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");//"http://159.89.14.24:8545");//
      this.saveToLocal("ViewTransactionAddressURL",this.viewAddress);
      this.saveToLocal("ViewTransactionHashURL",this.viewHash);
    }
    setTimeout(()=>{this.saveInitVars();},500);
  }

  saveInitVars(){
    this.saveToLocalURL("SISNODEURL",this.angularnodeURL);
    this.saveToLocalURL("SISWEB3URL",this.web3url);//"https://mainnet.infura.io/2H9y3HfwB9FOuy0Gqr4m");
    this.saveToLocal("ViewTransactionAddressURL",this.viewAddress);
    this.saveToLocal("ViewTransactionHashURL",this.viewHash);
    // console.log("always in ",this.retrieveFromLocalURL("SISWEB3URL"))
  }

  InitKeyGet():String{
    let str = this.localStorageService.retrieve("SISKeystore");
    return str;
  }

  saveToLocal(name,s){
    try{
      let key = this.InitKeyGet();
      let str = (CryptJS.AES.encrypt(s,key)).toString();
      this.localStorageService.store(name,str);
    }catch(e){

    }
  }

  retrieveFromLocal(name):String{
    try{
      let key = this.InitKeyGet();
      let fromStore = this.localStorageService.retrieve(name);
      if( fromStore == "" || fromStore == null || fromStore == undefined ){
        return "";
      }else{
        let decrypt = CryptJS.AES.decrypt(fromStore,key);
        let str = decrypt.toString(CryptJS.enc.Utf8);
        return str;
      }
    }catch(e){
      
    }
  }

  clearStorage():String{
    this.localStorageService.clear();
    let chk = this.InitKeyGet();
    let val;
    if( chk == "" || chk == undefined || chk == null){
      let key = "This is just a demo";
      val = sha256(key);
      this.localStorageService.store("SISKeystore",val);
    }
    return val;
  }

  saveToLocalURL(name,s){
    let key = "This is a url";
    let str = (CryptJS.AES.encrypt(s,key)).toString();
    this.localStorageService.store(name,str);
  }

  retrieveFromLocalURL(name):String{
    let key = "This is a url";
    let fromStore = this.localStorageService.retrieve(name);
    if( fromStore == "" || fromStore == null || fromStore == undefined ){
      return "";
    }else{
      let decrypt = CryptJS.AES.decrypt(fromStore,key);
      let str = decrypt.toString(CryptJS.enc.Utf8);
      return str;
    }
  }
}
