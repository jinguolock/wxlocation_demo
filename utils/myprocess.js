var util = require('util');
var blueApi = require('ble.js').Ble;
var myApi = require('myapi.js').MyServerApi;
let myProcess = {

  sendBleByAuth(deviceId, content, command, reFunc, msgFunc, sendFinishFunc,failFunc) {
    var _this = this;
    var willsendbyte;
    var did=deviceId.substr(2);
    console.log("get pwd by did:"+did);
    myApi.webmain("location", "getpwd", { id: did }, function (obj) {
      if (obj != null && obj.pwd != null) {
        msgFunc && msgFunc("数据完成，准备操作……")
        willsendbyte = _this.getHexByStr(obj.pwd);
        //simpleSendBleMsg(deviceName,content,crypt,command,timeout,isCloseFinish,reFunc,msgFunc,failFunc)
        blueApi.simpleSendBleMsg( deviceId, content, willsendbyte, command, 30000, true, reFunc, msgFunc, sendFinishFunc,failFunc)
      }
    }, function (err) {
      msgFunc && msgFunc("准备数据失败，网络错误:"+err)
    }
    )
  },
  sendBleByAuthPwd(deviceId,pwd, content, command, reFunc, msgFunc, sendFinishFunc, failFunc) {
    var _this = this;
    var willsendbyte;
    var did = pwd;
    console.log("get pwd :" + did);
    myApi.webmain("location", "getpwd", { id: did }, function (obj) {
      if (obj != null && obj.pwd != null) {
        msgFunc && msgFunc("数据完成，准备操作……")
        willsendbyte = _this.getHexByStr(obj.pwd);
        //simpleSendBleMsg(deviceName,content,crypt,command,timeout,isCloseFinish,reFunc,msgFunc,failFunc)
        blueApi.simpleSendBleMsg(deviceId, content, willsendbyte, command, 30000, true, reFunc, msgFunc, sendFinishFunc, failFunc)
      }
    }, function (err) {
      msgFunc && msgFunc("准备数据失败，网络错误:" + err)
    }
    )
  },
  sendBleByAuthPwdBeacon(beaconmj, pwd, content, command, reFunc, msgFunc, sendFinishFunc, failFunc) {
    var _this = this;
    var willsendbyte;
    var did = pwd;
    console.log("get pwd :" + did);
    myApi.webmain("location", "getpwd", { id: did }, function (obj) {
      if (obj != null && obj.pwd != null) {
        msgFunc && msgFunc("数据完成，准备操作……")
        willsendbyte = _this.getHexByStr(obj.pwd);
        //simpleSendBleMsg(deviceName,content,crypt,command,timeout,isCloseFinish,reFunc,msgFunc,failFunc)
        blueApi.simpleSendBleMsgBeacon(beaconmj, content, willsendbyte, command, 30000, true, reFunc, msgFunc, sendFinishFunc, failFunc)
      }
    }, function (err) {
      msgFunc && msgFunc("准备数据失败，网络错误:" + err)
    }
    )
  },
  syncParameter(deviceId,msgFunc,reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
     var content = new Uint8Array(1);
     content[0]=1;
    this.sendBleByAuth(deviceId, content, 0x30,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  syncParameter_station(deviceId, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var content = new Uint8Array(1);
    content[0] = 1;
    this.sendBleByAuth(deviceId, content, 0x41,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  syncParameter_station_adv(deviceId, msgFunc, reFunc) {
    var _this = this;
    var content = new Uint8Array(1);
    content[0] = 1;
    this.sendBleByAuth(deviceId, content, 0x44,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  syncParameter_dtu(deviceId, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var content = new Uint8Array(1);
    content[0] = 1;
    this.sendBleByAuth(deviceId, content, 0x55,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
    syncParameter_beacon(beaconmj,pwd, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var content = new Uint8Array(1);
    content[0] = 1;
      
      this.sendBleByAuthPwd(beaconmj, pwd,content, 0x50,
      //this.sendBleByAuthPwdBeacon(beaconmj, pwd,content, 0x50,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter(deviceId, sendInterval, blescan, lorasf, accthres, sendtime,beaconMask, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var content = new Uint8Array(13);
    content[0] = lorasf&0xff;
    content[1] = sendInterval & 0xff;
    content[2] = accthres & 0xff;
    content[3] = 0 & 0xff;
    content[4] = sendtime & 0xff;
    content[5] = (blescan>>8) & 0xff;
    content[6] = blescan & 0xff;
    content[7] = 0 & 0xff;
    content[8] = 80 & 0xff;
    content[9] = (beaconMask >> 8) & 0xff;
    content[10] = beaconMask & 0xff;
     content[11] = 0x88;
     content[12] = 0x77;
    //content[11] = 0xC6;
    //content[12] = 0xB1;
    this.sendBleByAuth(deviceId, content, 0x31,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter2(deviceId, sendInterval, sendtime, beaconMask,beaconValue,thresValue,alarmtype,advInterval,loraEn, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var lorasf=12;
    var accthres = thresValue;
    var blescan=160;
    var alarmnumber=10;
    var content = new Uint8Array(20);
    content[0] = lorasf & 0xff;
    content[1] = sendInterval & 0xff;
    content[2] = accthres & 0xff;
    content[3] = 0 & 0xff;
    content[4] = sendtime & 0xff;
    content[5] = (blescan >> 8) & 0xff;
    content[6] = blescan & 0xff;
    content[7] = 0 & 0xff;
    content[8] = 80 & 0xff;
    content[9] = (beaconMask >> 8) & 0xff;
    content[10] = beaconMask & 0xff;
    content[11] = (beaconValue >> 8) & 0xff;
    content[12] = beaconValue & 0xff;
    content[13] = alarmtype & 0xff;
    content[14] = alarmnumber & 0xff;
    content[15] = (advInterval >> 24) & 0xff;
    content[16] = (advInterval >> 16) & 0xff;
    content[17] = (advInterval >> 8) & 0xff;
    content[18] = (advInterval) & 0xff;
    content[19] = (loraEn) & 0xff;
    //content[11] = 0xC6;
    //content[12] = 0xB1;
    this.sendBleByAuth(deviceId, content, 0x31,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter_tomode(deviceId, modenumer, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var content = new Uint8Array(1);
    content[0] = modenumer & 0xff;
    this.sendBleByAuth(deviceId, content, 0x34,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter_stationNet(deviceId, ip, mask, gw, dns, sendto, isstatic, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var ipArr = this.getIpArrByStr(ip);
    var maskArr = this.getIpArrByStr(mask);
    var gwArr = this.getIpArrByStr(gw);
    var dnsArr = this.getIpArrByStr(dns);
    var sendtoArr = this.getIpArrByStr(sendto);

    var content = new Uint8Array(21);
    var ptr=0;
    for(var i=0;i<4;i++){
      content[ptr]=ipArr[i];
      ptr++;
    }
    for (var i = 0; i < 4; i++) {
      content[ptr] = maskArr[i];
      ptr++;
    }
    for (var i = 0; i < 4; i++) {
      content[ptr] = gwArr[i];
      ptr++;
    }
    for (var i = 0; i < 4; i++) {
      content[ptr] = dnsArr[i];
      ptr++;
    }
    for (var i = 0; i < 4; i++) {
      content[ptr] = sendtoArr[i];
      ptr++;
    }
    content[ptr] = isstatic&0xff;
    ptr++;

    //content[11] = 0xC6;
    //content[12] = 0xB1;
    this.sendBleByAuth(deviceId, content, 0x40,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter_stationAdv(deviceId, interval, online, mask, mvalue, beacon,reset, msgFunc, reFunc) {
    var _this = this;

    var content = new Uint8Array(14);
    content[0] = (mask>>8) & 0xff;
    content[1] = (mask) & 0xff;

    content[2] = (mvalue >> 8) & 0xff;
    content[3] = (mvalue) & 0xff;

    content[4] = (interval >> 24) & 0xff;
    content[5] = (interval >> 16) & 0xff;
    content[6] = (interval >> 8) & 0xff;
    content[7] = (interval) & 0xff;

    content[8] = beacon&0xff;
    content[9] = online&0xff;

    content[10] = (reset >> 24) & 0xff;
    content[11] = (reset >> 16) & 0xff;
    content[12] = (reset >> 8) & 0xff;
    content[13] = (reset) & 0xff;

    this.sendBleByAuth(deviceId, content, 0x43,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configToDfu_station(deviceId, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }

    var content = new Uint8Array(1);
    content[0]=1;
    this.sendBleByAuth(deviceId, content, 0x42,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter_dtu(deviceId, runmode, loramode, channel,sf, power, baud, sleep, support, ask, msgFunc, reFunc) {
    var _this = this;
    
    var channelarr = _this.getHexByStr2(channel);
    var askarr = _this.getHexByStrSpace(ask);
    
    sleep = sleep*1000;
    var content = new Uint8Array(15 + askarr.length);
    content[0] = sleep&0xff;
    content[1] = (sleep>>8) & 0xff;
    content[2] = (sleep >> 16) & 0xff;
    content[3] = (sleep >> 24) & 0xff;
    content[4] = channelarr[0];
    content[5] = channelarr[1];
    content[6] = channelarr[2];
    content[7] = sf & 0xff;
    content[8] = power & 0xff;
    content[9] = loramode & 0xff;
    content[10] = runmode & 0xff;
    content[11] = baud & 0xff;
    content[12] = support & 0xff;
    content[13] = 1;
    content[14] = askarr.length;
    for (var i = 0; i < askarr.length;i++){
      content[15 + i] = askarr[i];
    }

    this.sendBleByAuth(deviceId, content, 0x56,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter_dtuID(deviceId,changeID, msgFunc, reFunc) {
    var _this = this;

    var idarr = _this.getHexByStr2(changeID);

    var content = new Uint8Array(4);

    content[0] = idarr[0];
    content[1] = idarr[1];
    content[2] = idarr[2];
    content[3] = idarr[3];
    this.sendBleByAuth(deviceId, content, 0x57,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configParameter_beacon(beaconmj,pwd, major, minor, rssi, send, tx, setpwdval, msgFunc, reFunc) {
    var _this = this;
    var content = new Uint8Array(14);
    var pwdarr =_this.getHexByStr2(setpwdval);
    var updateInterval=500;
    content[0] = pwdarr[0];
    content[1] = pwdarr[1];
    content[2] = pwdarr[2];
    content[3] = pwdarr[3];
    content[4] = (major >> 8) & 0xff;
    content[5] = major & 0xff;
    content[6] = (minor >> 8) & 0xff;
    content[7] = minor & 0xff;
    content[8] = (send >> 8) & 0xff;
    content[9] = send & 0xff;
    content[10] = (updateInterval >> 8) & 0xff;
    content[11] = updateInterval & 0xff;
    content[12] = rssi & 0xff;
    content[13] = tx & 0xff;
    this.sendBleByAuthPwd(beaconmj,pwd, content, 0x51,
    //this.sendBleByAuthPwdBeacon(beaconmj,pwd, content, 0x51,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  configUuid_beacon(beaconmj, pwd, uuid,msgFunc, reFunc) {
    var _this = this;
    var content = new Uint8Array(16);
    var uuidarr = _this.getHexByStr2(uuid);
    for(var i=0;i<16;i++){
      content[i] = uuidarr[i];
    }
    
    this.sendBleByAuthPwd(beaconmj, pwd, content, 0x52,
      //this.sendBleByAuthPwdBeacon(beaconmj,pwd, content, 0x51,
      function (msg) {
        console.log("recivelength::" + (msg.length) + "::" + (_this.getStrByHex(msg)))
        reFunc && reFunc(msg);
      }, msgFunc)
  },
  getStrByHex(hexArr){
    var hexStr = '';
    for (var i = 0; i < hexArr.length; i++) {
      var str = hexArr[i];
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
      if (i!=(hexArr.length-1)){
        hexStr+=',';
      }
    }

    return hexStr;
  },
  getStrByHex2(hexArr) {
    var hexStr = '';
    for (var i = 0; i < hexArr.length; i++) {
      var str = hexArr[i];
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }
    return hexStr;
  },
  getStrByHexLength(hexArr,start,len) {
    var hexStr = '';
    for (var i = start; i < len; i++) {
      var str = hexArr[i];
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }
    return hexStr;
  },
  getHexByStr(hexStr) {
    var strs = hexStr.split(",");
    var re = new Uint8Array(strs.length);
    for (var i = 0; i < strs.length; i++) {
      re[i] = parseInt(strs[i], 16) & 0xff;
    }

    return re;
  },
  getHexByStrSpace(hexStr) {
    var strs = hexStr.split(" ");
    var re = new Uint8Array(strs.length);
    for (var i = 0; i < strs.length; i++) {
      re[i] = parseInt(strs[i], 16) & 0xff;
    }

    return re;
  },
  getIpArrByStr(ipStr){
    var strs = ipStr.split(".");
    var re = new Uint8Array(strs.length);
    for (var i = 0; i < strs.length; i++) {
      re[i] = parseInt(strs[i], 10) & 0xff;
    }
    return re;
  },
  getHexByStr2(hexStr) {
    if (!hexStr) {
      return new Uint8Array(0);
    }
    var content = new Uint8Array(hexStr.length/2);
   // var buffer = new ArrayBuffer(str.length);
   // let dataView = new DataView(buffer)

    let ind = 0;
    for (var i = 0, len = hexStr.length; i < len; i += 2) {
      let code = parseInt(hexStr.substr(i, 2), 16)
     // dataView.setUint8(ind, code)
      content[ind]=code;
      ind++
    }

    return content;
  },
  getArrayBuffByStr(hexStr){
    var strs = hexStr.split(",");
    var buf = new ArrayBuffer(bs.length);
    let dataView = new DataView(buf)
    for (var i = 0; i < strs.length; i++) {
      dataView.setUint8(i, parseInt(strs[i], 16) & 0xff)
    }
    return re
  },
  getDateByStr(dateStr) {
    var strs = dateStr.split("_");
    var d1 = strs[0].split("-");
    var d2 = strs[1].split(":");
    var re=new Date();
    re.setFullYear(parseInt(d1[0], 10), parseInt(d1[1], 10) - 1, parseInt(d1[2], 10));
    re.setHours(parseInt(d2[0], 10), parseInt(d2[1], 10), parseInt(d2[2], 10));
    return re
  }
  /*其他辅助模块*/
}
module.exports.MyProcess = myProcess;
