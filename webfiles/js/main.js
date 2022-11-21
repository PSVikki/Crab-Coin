

if (window.location.href.includes("r=0x")) { //new ref
  referralAddress = getAllUrlParams(window.location.href).r;
  document.cookie = "r=" + referralAddress + "; expires=Monday, 01 Jan 2120 12:00:00 UTC; path=/";
  console.log("new ref cookie: " + referralAddress);
} else { //get cookie
  var cookie = getCookie("r");
  if (cookie != "" && cookie.includes("0x")) { //cookie found
    referralAddress = cookie;
    console.log("cookie ref: " + referralAddress);
  } else { //cookie nor url ref found 
    referralAddress = "0x0000000000000000000000000000000000000000";
    console.log("ref: " + referralAddress);
  }
}

setInterval(function(){
    GetPriceData();
    GetAPYData();
    ShowBalance();
  }, 30000);
  
      /*var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           var json = JSON.parse(xhttp.responseText);
           console.log(json);
           //eth price in USD
           var ethUsd = json.ethereum.usd;
           //total reserves
           var reserves = await crabLpContract.methods.getReserves().call();
           //crabPerEth
           var h = await uniRouter.methods.quote("1000000000000000000", reserves[0], reserves[1]).call();
  
           var crabPerEth = web3.utils.fromWei(h);
 
        }
    };
    xhttp.open("GET", "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd", true);
    xhttp.send();*/
  async function GetPriceData(){
    var crabUsd = 0;
    var ts = await crabContract.methods.totalSupply().call();
           var tst = await crabContract.methods.balanceOf(crabContractAddress).call();
           //var tst = await crabContract.methods.totalStaked().call();
           document.getElementById("totalSupplyCounter").innerHTML = toFixedMax(web3.utils.fromWei(ts),0);
           document.getElementById("totalCrabSupply").innerHTML = toFixedMax(web3.utils.fromWei(ts),0) + " CRAB";
           document.getElementById("totalCrabSupplyValue").innerHTML = "$" + toFixedMax(web3.utils.fromWei(ts) * crabUsd,2);
           document.getElementById("totalCrabStaked").innerHTML = toFixedMax(web3.utils.fromWei(tst),0) + " CRAB";
           document.getElementById("totalCrabStakedValue").innerHTML = "$" + toFixedMax(web3.utils.fromWei(tst) * crabUsd,2);
           //document.getElementById("priceCounter").setAttribute("data-countup", toFixedMax(crabUsd,2).toString()); 
           document.getElementById("priceCounter").innerHTML = "$" + toFixedMax(crabUsd,5);
           document.getElementById("marketCapCounter").innerHTML = "$" + toFixedMax(web3.utils.fromWei(ts) * crabUsd, 2)
           staker = await crabContract.methods.staker(activeAccount).call();
           var rb = web3.utils.fromWei(staker.totalReferralBonus.toString());
           var ie = web3.utils.fromWei(staker.totalStakingInterest.toString());

           document.getElementById("totalReferralBonus").innerHTML = toFixedMax(rb,18) + " CRAB";
           document.getElementById("totalReferralBonusValue").innerHTML = "$" + toFixedMax(rb * crabUsd,2);
           document.getElementById("totalEarnedInterest").innerHTML = toFixedMax(ie,0) + " CRAB";
           document.getElementById("totalEarnedInterestValue").innerHTML = "$" + toFixedMax(ie * crabUsd,2);
           var burnt = web3.utils.fromWei(staker.totalBurnt);
           console.log(burnt);
            document.getElementById("crabBurnt").innerHTML = toFixedMax(burnt,8) + " CRAB";
            var staked = web3.utils.fromWei(staker.stakedBalance);
            console.log(staked);
            document.getElementById("crabStaked").innerHTML = toFixedMax(staked,8) + " CRAB";
            document.getElementById("crabStaked2").innerHTML = toFixedMax(staked,8) + " CRAB";
            var claimable = web3.utils.fromWei(await crabContract.methods.calcStakingRewards(activeAccount).call());
            document.getElementById("crabStakingRewards").innerHTML = claimable  + " CRAB";
            var totalStakingInterest = web3.utils.fromWei(staker.totalStakingInterest);
            //var burnAdjust = await crabContract.methods.burnAdjust().call();
            var burnAdjust = 10;
            var availableToBurn = (totalStakingInterest * burnAdjust) - burnt;
            var balance = web3.utils.fromWei(await crabContract.methods.balanceOf(activeAccount).call());
            document.getElementById("availableToBurn").innerHTML = toFixedMax((availableToBurn),18);  + " CRAB";
            document.getElementById("crabBalanceBurningValue").innerHTML = " @ $" + toFixedMax(balance * crabUsd,2);
            document.getElementById("crabBalanceStakingValue").innerHTML = " @ $" + toFixedMax(balance * crabUsd,2);
            document.getElementById("crabStakedValue").innerHTML = " @ $" + toFixedMax(staked * crabUsd,2);
            document.getElementById("crabStaked2Value").innerHTML = " @ $" + toFixedMax(staked * crabUsd,2);
            document.getElementById("crabStakingRewardsValue").innerHTML = "$" + toFixedMax(claimable * crabUsd,2);
  }
  
  function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  function GetAPYData(){
    GetStakingApy();
    GetTimeTillEndstake();
  }

  async function GetTimeTillEndstake() {
    var staker = await crabContract.methods.staker(activeAccount).call();
    var stakeStart = staker.stakeStartTimestamp;
    var daysSeconds = 86400;
    var endTime = parseInt(stakeStart) + (daysSeconds * 7);
    var now = Date.now() / 1000;
    var secondsTill = endTime - now;
    if(staker.stakedBalance <= 0){
      document.getElementById("crabStakingDaysLeft").innerHTML = "N/A";
    }
    else{
      if(secondsTill <= 0){
        document.getElementById("crabStakingDaysLeft").innerHTML = "Finished!";
      }
      else{
        var minutesTill = secondsTill / 60;
        var hoursTill = minutesTill / 60;
        var daysTill = hoursTill / 24;
        document.getElementById("crabStakingDaysLeft").innerHTML = toFixedMax(daysTill, 3) + " day/s";
      }
    }
  }
  
  async function GetStakingApy(){

              //get USD price of crab
             // var crabUsd = ethUsd / crabPerEth;

              var apyAdjust = 10000;
              var staker = await crabContract.methods.staker(activeAccount).call();
              var userStakeDeposit = staker.stakedBalance;
              //var stakedValue = crabUsd * web3.utils.fromWei(userStakeDeposit);
              var burntBalance = staker.totalBurnt;
               if(burntBalance == 0){
                 apyAdjust = 10000;
               }
               else{
                 var burntPercentage = ((burntBalance * 100) / userStakeDeposit);
                 console.log(burntPercentage + " PERCENT")
                 var v = (10000 * burntPercentage) / 100;
                 apyAdjust = (apyAdjust - v);
                 if(apyAdjust < 1000)
                 {
                     apyAdjust = 1000;
                 }
               }
               if(userStakeDeposit == 0){
                 document.getElementById("crabStakingAPY").innerHTML = (4.20).toFixed(2) + "%";
               }
               else{
                var crabPerMinute = (userStakeDeposit / apyAdjust / 1251) * 1;
                console.log(crabPerMinute);
                var crabPerYear = crabPerMinute * 525600;
               // var usdPerYear = web3.utils.fromWei(crabPerMinute.toString()) * crabUsd * 525600;
                //get x multiple
                //var annualXGainz = (usdPerYear / stakedValue);
                var annualXGainz = (crabPerYear / userStakeDeposit);
                console.log(annualXGainz + " annual x gains");
                //get percent APY
                var apyPercent = annualXGainz * 100;
                console.log(apyPercent + " percent");
                document.getElementById("crabStakingAPY").innerHTML = apyPercent.toFixed(2) + "%";
               }

  }

  async function StakeTokens() {
    if (!sendok) {
      errorMessage("Cannot send tx, please check connection");
      return;
    }
    if (typeof web3 !== "undefined") {
      var value = document.getElementById("stakeAmount").value;
      var balance = await crabContract.methods.balanceOf(activeAccount).call();
      if (value == null || value <= 0 || value == "") {
        errorMessage("Value must be greater than 0");
        return;
      }
      if (parseInt(web3.utils.fromWei(balance)) < parseInt(value)) {
        errorMessage("Insufficient available CRAB balance");
        return;
      }
      var _crab = web3.utils.toWei(value);
      crabContract.methods.StakeTokens(web3.utils.toHex(_crab), referralAddress).send({
        from: activeAccount
      })
      .on('receipt', function (receipt) {
        successMessage("CRAB staked successfully!");
        console.log(receipt);
      })
      .on('error', function (error){
        //errorMessage('Stake failed, try again');
        console.log(error);
      });
    }
  }
  
  async function UnstakeTokens() {
    var staker = await crabContract.methods.staker(activeAccount).call();
      var stakedCrab = staker.stakedBalance;
    if(stakedCrab == 0){
        errorMessage("Nothing to unstake");
        return;
      }
      var fin = await crabContract.methods.isStakeFinished(activeAccount).call();
    if(!fin){
      errorMessage("Cannot unstake yet");
      return;
    }
    else{
      crabContract.methods.UnstakeTokens().send({
          from: activeAccount
        })
      .on('receipt', function (receipt) {
        successMessage("Successfully unstaked CRAB");
        console.log(receipt);
      })
      .on('error', function () {
        console.error;
        //errorMessage("unstake failed, please try again...");
      }); 
    }
  }

  async function ClaimInterest() {
    var claimable = await crabContract.methods.calcStakingRewards(activeAccount).call();
    if(claimable == 0){
      errorMessage("Nothing to claim");
      return;
    }
      crabContract.methods.ClaimStakeInterest().send({
          from: activeAccount
        })
      .on('receipt', function (receipt) {
        successMessage("Successfully claimed staking interest in CRAB");
        console.log(receipt);
      })
      .on('error', function () {
        console.error;
        //errorMessage("Claim failed, please try again later...");
      }); 
  }
  
  async function RollInterest() {
     var claimable = await crabContract.methods.calcStakingRewards(activeAccount).call();
      if(claimable == 0){
        errorMessage("Nothing to roll");
        return;
      }
      crabContract.methods.RollStakeInterest().send({
          from: activeAccount
        })
      .on('receipt', function (receipt) {
        successMessage("Successfully rolled staking interest.");
        console.log(receipt);
      })
      .on('error', function () {
        console.error;
        //errorMessage("Roll failed, please try again later...");
      }); 
  }

  async function BurnTokens() {
    if (!sendok) {
      errorMessage("Cannot send tx, please check connection");
      return;
    }
    if (typeof web3 !== "undefined") {
      var value = document.getElementById("burnAmount").value;
      var balance = await crabContract.methods.balanceOf(activeAccount).call();
      if (value == null || value <= 0 || value == "") {
        errorMessage("Value must be greater than 0");
        return;
      }
      if (parseInt(web3.utils.fromWei(balance)) < parseInt(value)) {
        errorMessage("Insufficient available CRAB balance");
        return;
      }
      var staker = await crabContract.methods.staker(activeAccount).call();
      var totalStakingInterest = web3.utils.fromWei(staker.totalStakingInterest);
      var burnt = web3.utils.fromWei(staker.totalBurnt);
      var availableToBurn = (totalStakingInterest * 10) - burnt;
      if(value > availableToBurn){
        errorMessage("Burn limit reached, you must mint more staking interest");
        return;
      }
      var _crab = web3.utils.toWei(value);
      crabContract.methods.BurnCrab(web3.utils.toHex(_crab)).send({
        from: activeAccount
      })
      .on('receipt', function (receipt) {
        successMessage("CRAB burnt successfully!");
        console.log(receipt);
      })
      .on('error', function (error){
        //errorMessage('Burn failed, try again');
        console.log(error);
      });
    }
  }
  
  /*----------HELPER FUNCTIONS------------ */
  
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function getAllUrlParams(url) {
  
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
  
        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
  
        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
  
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
  
          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }
  
    return obj;
  }
  
  function doSort(ascending) {
      ascending = typeof ascending == 'undefined' || ascending == true;
      return function (a, b) {
          var ret = a[1] - b[1];
          return ascending ? ret : -ret;
      };
  }
  
  function numStringToBytes32(num) {
    var bn = new web3.utils.BN(num).toTwos(256);
    return padToBytes32(bn.toString(16));
  }
  
  function bytes32ToNumString(bytes32str) {
    bytes32str = bytes32str.replace(/^0x/, '');
    var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
    return bn.toString();
  }
  
  function bytes32ToInt(bytes32str) {
    bytes32str = bytes32str.replace(/^0x/, '');
    var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
    return bn;
  }
  
  function padToBytes32(n) {
    while (n.length < 64) {
      n = "0" + n;
    }
    return "0x" + n;
  }
  
  function toFixedMax(value, dp) {
    return +parseFloat(value).toFixed(dp);
  }