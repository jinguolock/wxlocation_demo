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
    syncParameter_beacon(deviceId, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var content = new Uint8Array(1);
    content[0] = 1;
    this.sendBleByAuth(deviceId, content, 0x50,
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
  configParameter2(deviceId, sendInterval, sendtime, beaconMask,beaconValue,thresValue,alarmtype, msgFunc, reFunc) {
    var _this = this;
    // var content = new Uint8Array(4500);
    // for(var i=0;i<4500;i++){
    //   content[i] = (i&0xff);
    // }
    var lorasf=12;
    var accthres = thresValue;
    var blescan=160;
    var alarmnumber=10;
    var content = new Uint8Array(15);
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
    //content[11] = 0xC6;
    //content[12] = 0xB1;
    this.sendBleByAuth(deviceId, content, 0x31,
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
  getHexByStr(hexStr) {
    var strs = hexStr.split(",");
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
