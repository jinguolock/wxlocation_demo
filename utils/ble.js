var nus_service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
//notify: false, write: true, indicate: false, read: false}
var char_tx = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
//notify: true, write: false, indicate: false, read: false}
var char_rx = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
var myNusDataCache = new Uint8Array(8000);
var myNusDataCache_length = 0;
var stationMap=new Object();
var timerId;
let blueApi = {
  blue_data: {
    device_id: "",
    service_id: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
    write_id: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
    notify_id: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E",
    startTransfer:0,
    currentLength:0,
    beacon_mj:""
  },
  getStationNames(){
    var re=new Array();
    for (let i in stationMap) {
      re.push(i);
    }
    return re;
  },
  getStationNameRssi() {
    var re = new Array();
    for (let i in stationMap) {
      var o=new Object();
      o.deviceName=i;
      o.rssi = stationMap[i];
      re.push(o);
    }
    return re;
  },
  clearNameRssi() {
    stationMap=new Object();
  },
  getCacheReturnContent(){
   // this.getcheck(myNusDataCache, 0, bs.length) & 0xff;
    // var length = ((myNusDataCache[4] << 8) & 0xFF00) | (myNusDataCache[5] & 0xFF);
    // if((length+14)!=myNusDataCache_length){
    //   console.log("receive length is error recevice:" + myNusDataCache_length + "should:" + (length + 14));
    //   return null;
    // }
    // var crc = this.getcheck(myNusDataCache, 8, 8+length) & 0xff;
    // if (myNusDataCache[myNusDataCache_length-3]!=crc){
    //   console.log("receive crc is error recevice:" + myNusDataCache[myNusDataCache_length - 3] + "should:" + crc);
    //   return null;
    // }
    // var re = new Uint8Array(length);
    // for(var i=0;i<length;i++){
    //   re[i] = myNusDataCache[i+8];
    // }
    var re = new Uint8Array(myNusDataCache_length);
    for (var i = 0; i < myNusDataCache_length;i++){                                       
      re[i] = myNusDataCache[i];
    }
    return re;
  },
  //crypt must 8 bytes
  simpleSendBleMsg(deviceName,content,crypt,command,timeout,isCloseFinish,reFunc,msgFunc,sendFinishFunc,failFunc){
    var _this = this;
    clearTimeout(timerId);
    _this.blue_data.device_id = deviceName;
    _this.onOpenNotifyListener = (function () {
      console.log("notify is ready")
      clearTimeout(timerId);
      _this.sendProtoHex(content, crypt, command);
      sendFinishFunc && sendFinishFunc();
      // setTimeout(function () {
      //   _this.getCacheReturnContent()
      //   reFunc && refunc(_this.getCacheReturnContent())
      // },500);
    })
    _this.completeTransfer = (function (msg) {
      if (isCloseFinish){
        _this.disconnect()
      }
      _this.blue_data.runFlag = 1
      reFunc && reFunc(msg)
    })
    // _this.onNotifyListener = (function (msg) {
    //   console.log(msg)
    //   if (isCloseFinish){
    //     _this.disconnect()
    //     console.log("")
    //   }
    //   _this.runFlag = 1
    //   successFunc && successFunc(msg)
    // })
  //
    _this.connect();
    timerId=setTimeout(function () {
    _this.stopSearch();
    _this.disconnect();
    msgFunc && msgFunc("未连接，蓝牙失败！");
    failFunc && failFunc();
    }, 15000);
  },
  simpleSendBleMsgBeacon(beaconmj, content, crypt, command, timeout, isCloseFinish, reFunc, msgFunc, sendFinishFunc, failFunc) {
    var _this = this;
    clearTimeout(timerId);
    _this.blue_data.beacon_mj = beaconmj;
    _this.onOpenNotifyListener = (function () {
      console.log("notify is ready")
      clearTimeout(timerId);
      _this.sendProtoHex(content, crypt, command);
      sendFinishFunc && sendFinishFunc();
      // setTimeout(function () {
      //   _this.getCacheReturnContent()
      //   reFunc && refunc(_this.getCacheReturnContent())
      // },500);
    })
    _this.completeTransfer = (function (msg) {
      if (isCloseFinish) {
        _this.disconnect()
      }
      _this.blue_data.runFlag = 1
      reFunc && reFunc(msg)
    })
    // _this.onNotifyListener = (function (msg) {
    //   console.log(msg)
    //   if (isCloseFinish){
    //     _this.disconnect()
    //     console.log("")
    //   }
    //   _this.runFlag = 1
    //   successFunc && successFunc(msg)
    // })
    //
    _this.connectBeacon();
    timerId = setTimeout(function () {
      _this.stopSearch();
      _this.disconnect();
      msgFunc && msgFunc("未连接，蓝牙失败！");
      failFunc && failFunc();
    }, 15000);
  },
  searchBleDevices(pre) {
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }

    var _this = this;
    this.clearNameRssi() 
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("ble ready complete")
        _this.startSearchBleNames(pre);
      }
    })
  },
  searchBleDevicesMac(after) {
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }

    var _this = this;
    this.clearNameRssi()
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("ble ready complete")
        _this.startSearchBleMacs(after);
      }
    })
  },
  connect() {
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }
    
    var _this = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("ble ready complete")
        _this.startSearch();
       }
    })
  },
  connectBeacon() {
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }

    var _this = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("ble beacon ready complete")
        _this.startSearchBeacon();
      }
    })
  },
  //发送消息
  sendMsg(msg, toArrayBuf = true) {
    let _this = this;
    let buf = toArrayBuf ? this.hexStringToArrayBuffer(msg) : msg;
    wx.writeBLECharacteristicValue({
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      characteristicId: _this.blue_data.write_id,
      value: buf,
      success: function (res) {
        console.log(res);
      }
    })
  },
  sendHex(bs) {
    let _this = this;
    var buf = new ArrayBuffer(bs.length);
    let dataView = new DataView(buf)
    for (var i = 0, len = bs.length; i < len; i ++) {
      dataView.setUint8(i,bs[i])
    }
    console.log("send hex:" + _this.arrayBufferToHexString(buf))
    wx.writeBLECharacteristicValue({
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      characteristicId: _this.blue_data.write_id,
      value: buf,
      success: function (res) {
       // console.log(res);
      }
    })
  },
  
  getcheck(bs,start,end) {
    var temp = bs[start];
    for (var i = start + 1; i < end; i++) {
      temp^=bs[i];
    }
    return temp;
  },
  sleep(milliSeconds){
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
  },
  checkReceiveIsStart(buff){
    if(buff==null||buff.length!=8){
      //console.log("buff length is wrong!:"+buff.length);
      return false;
    }
    if(buff[0]!=0xcf){
      //console.log("buff start is wrong!:" + buff[0]);
      return false;
    }
    if(buff[7] != 0xcc) {
      //console.log("buff end is wrong!:" + buff[7]);
      return false;
    }
    var crc=this.getcheck(buff,1,6);
    if(crc!=buff[6]){
      console.log("crc is wrong crc in package is:" + buff[6]+",should be:"+crc);
      return false;
    }
    
    return true;
  },
  checkReceiveIsEnd(buff) {
    if (buff == null || buff.length != 6) {
      //console.log("buff length is wrong!" + buff.length);
      return false;
    }
    if (buff[0] != 0xdf) {
      //console.log("buff start is wrong!" + buff[0]);
      return false;
    }
    if (buff[5] != 0xdc) {
      //console.log("buff end is wrong!" + buff[5]);
      return false;
    }
    var crc = this.getcheck(buff, 1, 4);
    if (crc != buff[4]) {
      console.log("crc is wrong crc in package is:" + buff[4] + ",should be:" + crc);
      return false;
    }
    return true;
  },
  //start msg: cf 01 02 03 04(crypto pwd) 05 06 07 08 (crypto datetime) 01 (command type) 00(no use) 00 02(how many packages) 00 01 (total length)  01(crc) CC
  //msg (20 bytes) 00 00 00 00 ..... 00
  //msg (20 bytes) 00 00 00 00 ..... 00
  //end msg:   df 01 02(serial number) 03(all package crc) 04(no use) 01(crc) DC
  sendProtoHex(bs,cryptobs,command) {
    var start = new Uint8Array(17);
    var end = new Uint8Array(7);
    var numbers=0;
    var hasmod=true;
    if(bs.length%20==0){
      hasmod=false;
      numbers = Math.floor(bs.length / 20);
    }else{
      hasmod=true;
      numbers = Math.floor(bs.length / 20 + 1);
    }
    
    console.log("send packages:"+numbers);
    var length=bs.length;
    start[0]=0xcf;
    start[16]=0xcc;
    for (var i = 0; i < cryptobs.length;i++){
      start[i + 1] = cryptobs[i];
    }
    start[9]=0xFF&command;
    start[11]=(numbers>>8)&0xff;
    start[12] = (numbers) & 0xff;
    start[13] = (length >> 8) & 0xff;
    start[14] = (length) & 0xff;
    start[15] = this.getcheck(start,1,15)&0xff

    end[0]=0xdf;
    end[6]=0xdc;
    end[1]=0x00;
    end[2] = 0x00;
    end[3] = this.getcheck(bs, 0, bs.length) & 0xff;
    end[5] = this.getcheck(end, 1, 5) & 0xff;
    this.sendHex(start);
    //this.sleep(1);
    var temp=0;
    for (var i = 0; i < numbers; i++) {
      if(hasmod&&(i==(numbers-1))){
        var ll = bs.length % 20;
        var send = new Uint8Array(ll);
        for(var j=0;j<ll;j++){
          send[j]=bs[i*20+j];
        }
        this.sendHex(send);
      }else{
        var send = new Uint8Array(20);
        for (var j = 0; j < 20; j++) {
          send[j] = bs[i * 20 + j];
        }
        this.sendHex(send);
      }
     // this.sleep(1);
    }
    this.sendHex(end);

  },
  //监听消息
  //
  onNotifyChange() {
    var _this = this;
    wx.onBLECharacteristicValueChange(function (res) {
      //var ss=[0xAF];
      _this.addToCache(res.value);
      //_this.sendHex(ss);
      let msg = _this.arrayBufferToHexString(res.value);
     // _this.onNotifyListener && _this.onNotifyListener(msg);
      console.log(msg);
    })
  },
  disconnect() {
    var _this = this;
    wx.closeBLEConnection({
      deviceId: _this.blue_data.device_id,
      success(res) {
        console.log("disconnect ble:" + _this.blue_data.device_id)
      }
    })
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log(res)
      }
    })
  },
  /*事件通信模块*/

  /*连接设备模块*/
  getBlueState() {
    var _this = this;
    if (_this.blue_data.device_id != "") {
      console.log("ble cannot used")
      _this.connectDevice();
      return;
    }

    wx.getBluetoothAdapterState({
      success: function (res) {
        if (!!res && res.available) { //蓝牙可用
          console.log("ble can used")
          _this.startSearch();
        }
      }
    })
  },
  startSearchBleNames(pre) {
    var _this = this;
    stationMap = new Object();
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        wx.onBluetoothDeviceFound(function (res) {
          console.log("device length:" + res.devices[0].name )
          //console.log("device length:" + res.devices.length + "device name:" + res.devices[0].name + ";device mac:" + res.devices[0].deviceId)
          //var device = _this.filterDevice(res.devices);
          if (res.devices[0].name.length>0){
            var st = res.devices[0].name.substr(0,2);
            if (st == pre && res.devices[0].name.length==10){
              console.log("get station  name:" + res.devices[0].name);
              stationMap[res.devices[0].name] = res.devices[0].RSSI
            }
          }
          
        });
      }
    })
  },
  startSearchBleMacs(after) {
    var _this = this;
    stationMap = new Object();
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        wx.onBluetoothDeviceFound(function (res) {
         // console.log("device length:" + res.devices[0].name)
          console.log("device rssi:" + res.devices[0].RSSI + ";device name:" + res.devices[0].name + ";device mac:" + res.devices[0].deviceId)
          console.log("device uuid:" + _this.arrayBufferToHexString(res.devices[0].advertisData));
          var mj = _this.getBeaconMajorMinor(res.devices[0].advertisData);
          if(mj!=null){
            console.log("get beacon  name:" + mj);
            stationMap[mj] = res.devices[0].RSSI
          }
          //var device = _this.filterDevice(res.devices);
          // if (res.devices[0].name.length > 0) {
          //   var st = res.devices[0].name.substr(0, 2);
          //   if (st == pre && res.devices[0].name.length == 10) {
          //     console.log("get station  name:" + res.devices[0].name);
          //     stationMap[res.devices[0].name] = res.devices[0].RSSI
          //   }
          // }

        });
      }
    })
  },
  startSearch() {
    var _this = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        wx.onBluetoothDeviceFound(function (res) {
          //console.log("device length:" + res.devices[0].name )
          console.log("device length:" + res.devices.length+"device name:" + res.devices[0].name + ";device mac:" + res.devices[0].deviceId)
          //var device = _this.filterDevice(res.devices);
          
          if (res.devices[0].name == _this.blue_data.device_id) {
            _this.blue_data.device_id = res.devices[0].deviceId;
            _this.connectDevice();
            _this.stopSearch();
            
          }
        });
      }
    })
  },

  startSearchBeacon() {
    var _this = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        wx.onBluetoothDeviceFound(function (res) {
          //console.log("device length:" + res.devices[0].name )
          console.log("device adv:" + _this.arrayBufferToHexString(res.devices[0].advertisData))
          //var device = _this.filterDevice(res.devices);
          var mj = _this.getBeaconMajorMinor(res.devices[0].advertisData);
          if (mj != null && mj == _this.blue_data.beacon_mj) {
            console.log("get beacon  mj:" + mj);
            _this.blue_data.device_id = res.devices[0].deviceId;
            _this.connectDevice();
            _this.stopSearch();
          }
        });
      }
    })
  },

  //连接到设备
  connectDevice() {
    var _this = this;
    console.log("connectDevice device id:" + _this.blue_data.device_id)
    wx.createBLEConnection({
      deviceId: _this.blue_data.device_id,
      success(res) {
        console.log("connectDevice success:" + _this.blue_data.device_id)
        _this.getDeviceService();


      }
    })
  },
  //搜索设备服务
  getDeviceService() {
    var _this = this;
    wx.getBLEDeviceServices({
      deviceId: _this.blue_data.device_id,
      success: function (res) {
        for (var i = 0; i < res.services.length;i++){
          var service_id = res.services[i].uuid
          if (service_id == nus_service) {
            _this.getDeviceCharacter()
          }
        }
        
      }
    })
  },
  //获取连接设备的所有特征值  
  getDeviceCharacter() {
    let _this = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      success: function (res) {
        /*
        let notify_id, write_id, read_id;
        for (let i = 0; i < res.characteristics.length; i++) {
          let charc = res.characteristics[i];
          if (charc.properties.notify) {
            notify_id = charc.uuid;
          }
          if (charc.properties.write) {
            write_id = charc.uuid;
          }
          if (charc.properties.write) {
            read_id = charc.uuid;
          }
        }
        if (notify_id != null && write_id != null) {
          _this.blue_data.notify_id = notify_id;
          _this.blue_data.write_id = write_id;
          _this.blue_data.read_id = read_id;

         
        }*/

        _this.openNotify();
      }
    })
  },
  openNotify() {
    var _this = this;
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _this.blue_data.device_id,
      serviceId: _this.blue_data.service_id,
      characteristicId: _this.blue_data.notify_id,
      complete(res) {
        // setTimeout(function () {
        //   _this.onOpenNotify && _this.onOpenNotify();
        // }, 1000);
        //_this.onNotifyChange(); //接受消息
        
        console.log("notify enable")
        _this.onNotifyChange()
        _this.onOpenNotifyListener && _this.onOpenNotifyListener();
        // wx.onBLECharacteristicValueChange(function (res) {
        //   //console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
        //   console.log(_this.arrayBufferToHexString(res.value))
        // })
      }
    })
  },
  /*连接设备模块*/


  /*其他辅助模块*/
  //停止搜索周边设备  
  stopSearch() {
    var _this = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("stop search success!")
      }
    })
  },
  addToCache(buffer) {
    var _this = this;
    let bufferType = Object.prototype.toString.call(buffer)
    if (buffer != '[object ArrayBuffer]') {
      return
    }
    console.log("recv::" + _this.arrayBufferToHexString(buffer))
    // if (this.blue_data.startTransfer == 0){
    //   myNusDataCache = new Array(3000);
    //   myNusDataCache_length = 0;
    // }
    let dataView = new DataView(buffer);
    if (_this.blue_data.currentLength>0){
      for (var i = 0; i < dataView.byteLength && myNusDataCache_length < 8000; i++) {
        var vv = dataView.getUint8(i);
        myNusDataCache[myNusDataCache_length] = vv;
        myNusDataCache_length++;
      }
      _this.blue_data.currentLength--;
      return;
    }
    var myNusTransCache_length = dataView.byteLength;
    var myNusTransCache = new Uint8Array(myNusTransCache_length);
    for (var i = 0; i < dataView.byteLength; i++) {
      var vv = dataView.getUint8(i);
      myNusTransCache[i] = vv;
      // myNusDataCache[myNusDataCache_length] =vv;
      // myNusDataCache_length++;
    }

    if (_this.checkReceiveIsStart(myNusTransCache)) {
      //_this.blue_data.startTransfer = 1;
      myNusDataCache = new Array(8000);
      myNusDataCache_length = 0;
      _this.blue_data.currentLength = (myNusTransCache[2] << 8 & 0xff00) | (myNusTransCache[3]&0xff);
      var ll = (myNusTransCache[4] << 8 & 0xff00) | (myNusTransCache[5] & 0xff);
      console.log("~~~~~~~~~~~~recv start total pkg length::" + _this.blue_data.currentLength)
      console.log("~~~~~~~~~~~~recv start total data length::" + ll)
    }else if (_this.checkReceiveIsEnd(myNusTransCache)) {
      //_this.blue_data.startTransfer = 0;
      _this.blue_data.currentLength =0;
      _this.completeTransfer && _this.completeTransfer(_this.getCacheReturnContent());
    }else{
      for (var i = 0; i < myNusTransCache_length && myNusDataCache_length<8000; i++) {
        myNusDataCache[myNusDataCache_length] = myNusTransCache[i];
        myNusDataCache_length++;
      }
    }

  },
  getBeaconMajorMinor(buffer){
    let bufferType = Object.prototype.toString.call(buffer)
    if (buffer != '[object ArrayBuffer]') {
      return
    }
    let dataView = new DataView(buffer)
    if (dataView.byteLength!=25){
      return
    }
    if (dataView.getUint8(0) != 0x59 || dataView.getUint8(1) != 0x00 || dataView.getUint8(2) != 0x02 || dataView.getUint8(3) != 0x15 ) {
      return
    }
    //var str = dataView.getUint8(20);
    var buffer2 = new ArrayBuffer(4);
    let dataView2 = new DataView(buffer2);
    dataView2.setUint8(0, dataView.getUint8(20));
    dataView2.setUint8(1, dataView.getUint8(21));
    dataView2.setUint8(2, dataView.getUint8(22));
    dataView2.setUint8(3, dataView.getUint8(23));
    return this.arrayBufferToHexString(buffer2);
  },
  arrayBufferToHexString(buffer) {
    let bufferType = Object.prototype.toString.call(buffer)
    if (buffer != '[object ArrayBuffer]') {
      return
    }
    let dataView = new DataView(buffer)

    var hexStr = '';
    for (var i = 0; i < dataView.byteLength; i++) {
      var str = dataView.getUint8(i);
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }

    return hexStr.toUpperCase();
  },
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }

    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)

    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }

    return buffer;
  }
  /*其他辅助模块*/
}
module.exports.Ble = blueApi;
// (function(root) {
//     "use strict";

  


// })(this);
