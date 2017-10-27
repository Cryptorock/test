window.setVariableInterval = function(callbackFunc, timing) {
  var variableInterval = {
    interval: timing,
    callback: callbackFunc,
    stopped: false,
    runLoop: function() {
      if (variableInterval.stopped) return;
      var result = variableInterval.callback.call(variableInterval);
      if (typeof result == 'number')
      {
        if (result === 0) return;
        variableInterval.interval = result;
      }
      variableInterval.loop();
    },
    stop: function() {
      this.stopped = true;
      window.clearTimeout(this.timeout);
    },
    start: function() {
      this.stopped = false;
      return this.loop();
    },
    loop: function() {
      this.timeout = window.setTimeout(this.runLoop, this.interval);
      return this;
    }
  };

  return variableInterval.start();
};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    console.log('I sense web3...')
    startApp()
  } else {
    $("body").empty().append('<h1>This Dapp requires Metamask</h1><a href="https://metamask.io/" target="__blank"><img src="https://github.com/MetaMask/faq/raw/master/images/download-metamask.png"/></a>');
    $("body").css('background', 'white');
  }
})



var decimals = 1;
var name = "?";
var symbol = "?";
var contractAddress = '0x9e77d5a1251b6f7d456722a6eac6d2d5980bd891';

function startApp(){
  var vi
  var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]


  var MyContract = web3.eth.contract(abi);
  myContractInstance = MyContract.at(contractAddress);

  myContractInstance.allEvents([], function(error, log){
    if (!error) {
      if (log.event === 'smth') {
        // TODO
      }
    } else {
      console.log(error);
    }
  });


  myContractInstance.name(function(err, rz){
    name = rz
  })

  myContractInstance.symbol(function(err, rz){
    symbol = rz
  })

  myContractInstance.decimals(function(err, rz){
    decimals = rz
  })

  vi = setVariableInterval(function(){
    web3.eth.getAccounts(function(error, accounts){
      if (error) return;
      myContractInstance.balanceOf(accounts[0], function(err, rez) {
        rez = rez.dividedBy((new BigNumber("10")).toPower(decimals));
        $("#mybalance").val('' + rez.toString(10) );
      })
    })
  }, 100);
  vi.interval = 5000;

  vi = setVariableInterval(function(){
    web3.eth.getAccounts(function(error, accounts){
      if (error) return;
      web3.eth.getBalance(accounts[0], function(err,rez){
        if (err) return;
        var eth = (rez.dividedBy((new BigNumber("10")).toPower(18)).round(3).toString(10));
        $("#myethbalance").text(eth + '');
      })

    })
  }, 100);
  vi.interval = 5000;

  vi = setVariableInterval(function(){
    web3.eth.getAccounts(function(error, accounts){
      if (error) return;
      $("#myaddress").text(accounts[0]);
      $("#viewOnEtherscan").attr('href', 'https://etherscan.io/address/' + accounts[0]);
    })
  }, 100);
  vi.interval = 5000;

  vi = setVariableInterval(function(){
    $("#contractaddress").text(contractAddress)
  }, 100);
  vi.interval = 5000;


  vi = setVariableInterval(function(){
    var checkTime = function (i) {
      if (i < 10) i = "0" + i;
      return i;
    }
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    $("#currenttime").text(h + ":" + m + ":" + s)
  }, 100);
  vi.interval = 1000;


  vi = setVariableInterval(function(){
    web3.version.getNetwork((err, netId) => {
      switch (netId) {
      case "1":
        $("#network").text('This is the main network.')
        break
      case "2":
        $("body").css('background', 'white')
        $("body").empty().append('please switch to Main and reload this Dapp');
        break
      case "3":
        $("body").css('background', 'white')
        $("body").empty().append('please switch to Main and reload this Dapp');
        break
      default:
        $("body").css('background', 'white')
        $("body").empty().append('please switch to Main and reload this Dapp');
      }
    })
  }, 100);
  vi.interval = 5000;
}







function sendBrat(){
  if (!$("#license").is(':checked')) {
    alert('Please accept the license');
    return;
  }
  var amount = $("#sendAmount").val();
  var addr  = $("#sendAddress").val();
  amountSatoshis = amount * Math.pow(10, decimals);

  if (confirm("Are you sure you want to transfer " + amount + " tokens to " + addr + " ?")) {
    myContractInstance.transfer(addr, amountSatoshis, function(){})
  }
}




