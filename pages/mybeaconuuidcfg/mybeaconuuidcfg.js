
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var beaconId
var pwdval=""
var uuid18val = ""
var uuid916val = ""
var uuid1724val = ""
var uuid2532val = ""
var uuid18str=""
var uuid916str = ""
var uuid1724str = ""
var uuid2532str = ""
var mystationId

var staticStrarr = ["未知","动态", "静态"]
var tcpStrarr = ["unkown","UDP", "TCP"]

Page({
  data: {
    deviceId: "",
    majorstr:"",
    minorstr: "",
    uuidstr: "",
    rssistr: "",
    txstr: "",
    sendstr:"",
    batterystr: "",
    hardwarestr:"",
    motto:""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getArrIndex: function (v,arr) {
    var vv=v+0;
    for(var i=0;i<arr.length;i++){
      if(arr[i]==vv){
        return i;
      }
     
    }
    return -1;
  },
  onShow: function () {
    //console.log("station onShow")
    let that = this;
    mypage = this;
    //blueApi.searchBleDevices();
   // intervalid = setInterval(mypage.mytimeout, 1000);
    beaconId = wx.getStorageSync('configBeaconId')
    console.log("my beaconId:" + beaconId)
    if (pwdval==null||pwdval.length==0){
     // pwdval = beaconId
      pwdval = beaconId.substr(2)
    }
    
    mypage.setData({
      deviceId: beaconId
     })
  },
  onLoad: function () {
    mypage = this
    // mypage.setData({
    //   deviceId: wx.getStorageSync('configStationId')
    // })
  },
  setMotto: function (str) {
    var obj = new Object();
    mypage.setData({ motto: str })
  },
  sendstatic: function (e) {
    mypage.setData({ staticipstr: "静态"})
    staticipval = 1
  },
  senddhcp: function (e) {
    mypage.setData({ staticipstr: "动态" })
    staticipval = 2
  },
  pwdInputEvent:function(e){
    pwdval=e.detail.value
  },
  uuid18InputEvent: function (e) {
    uuid18val = e.detail.value
  },
  uuid916InputEvent: function (e) {
    uuid916val = e.detail.value
  },
  uuid1724InputEvent: function (e) {
    uuid1724val = e.detail.value
  },
  uuid2532InputEvent: function (e) {
    uuid2532val = e.detail.value
  },

  
  setError:function (msg){
    mypage.setData({
      motto: msg
    })
  },
  updateParameter: function (e) {
    if (uuid18val.length != 8) {
      console.log("uuid18val error:" + uuid18val + ";")
      mypage.setData({ motto: "UUID 1~8位数不对!" });
      return;
    }
    if (uuid916val.length != 8) {
      console.log("uuid916val error:" + uuid916val + ";")
      mypage.setData({ motto: "UUID 9~16位数不对!" });
      return;
    }
    if (uuid1724val.length != 8) {
      console.log("uuid1724val error:" + uuid1724val + ";")
      mypage.setData({ motto: "UUID 17~24位数不对!" });
      return;
    }
    if (uuid2532val.length != 8) {
      console.log("uuid2532val error:" + uuid2532val + ";")
      mypage.setData({ motto: "UUID 25~32位数不对!" });
      return;
    }
    if (pwdval.length != 8){
      console.log("pwdval or setpwdval error:" + pwdval + ";" + setpwdval)
      mypage.setData({ motto: "密码或设置数据有误!" });
      return;
    }
    var uuid = uuid18val + uuid916val + uuid1724val + uuid2532val;
    console.log("uuid:" + uuid);
    
    myProcess.configUuid_beacon(beaconId,pwdval, uuid,  function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 
    // myProcess.configParameter_stationNet(mystationId, ipval, maskval, gatewayval, dnsval, sendtoval, staticipval, function (msg) {
    //   mypage.setMotto(msg)
    // }, function (arr) {
    //   mypage.setData({ motto: "配置完成!" });
    // }) 


    // if (sendInterval == null || bleScan == null || loraSf == null || accThres == null || sendTime==null){
    //   console.log("data error")
    //   mypage.setData({motto: "数据不完整!"});
    //   return;
    // }
    // myProcess.configParameter(mypage.data.deviceId, sendInterval, bleScan, loraSf, accThres, sendTime,beaconMask, function (msg){
    //   mypage.setMotto(msg)
    // }, function (arr) {
    //   mypage.setData({ motto: "配置完成!" });
    // }) 
  },
 uint2int:function(num){
   if (num > 0xff / 2) {
     var a = ~0xff;
     num = num | a;
   }
   return num;
 },
  int2uint: function (num) {
    if (num < 0) {
      num = num & 0xff;
    }
    return num;
  },
  readParameter: function (e) {
    if (pwdval.length != 8 ) {
      console.log("pwdval error:" + pwdval)
      mypage.setData({ motto: "密码数据有误!" });
      return;
    }
    mypage.setData({ motto: "开始读取..." });
    console.log(e.detail.value);
    console.log("readParameter");
    myProcess.syncParameter_beacon(beaconId,pwdval, function (msg) {
      mypage.setMotto(msg)
    },function(arr){
      console.log(arr);
      if(arr==null||arr.length<32){
        console.log("error arr length:" + arr.length);
        return;
      }

      var battery = ((arr[0] & 0xff) << 8) | (arr[1] & 0xff);
      battery = battery / 1000;
      var hardware = "V" + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString() + "." + (arr[4] & 0xff).toString() + "." + (arr[5] & 0xff).toString();
      var sendInterval = ((arr[6] & 0xff) << 8) | (arr[7] & 0xff);
      var adv_time = ((arr[8] & 0xff) << 8) | (arr[9] & 0xff);
      var major = ((arr[10] & 0xff) << 8) | (arr[11] & 0xff);
      var minor = ((arr[12] & 0xff) << 8) | (arr[13] & 0xff);
      var rssi_level = mypage.uint2int(arr[14] & 0xff);
      var tx_power = mypage.uint2int(arr[15] & 0xff);
      var uuid="";
      for(var i=0;i<16;i++){
        var str = arr[i+16];
        var hex = (str & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        uuid += hex;
      }
      

      console.log("battery:" + battery);
      console.log("hardware:" + hardware);
      console.log("sendInterval:" + sendInterval);
      console.log("adv_time:" + adv_time);
      console.log("major:" + major);
      console.log("minor:" + minor);
      console.log("rssi_level:" + rssi_level);
      console.log("tx_power:" + tx_power);
      console.log("uuid:" + uuid);

      mypage.setData({ 
        uuid18str: uuid.substr(0, 8),
        uuid916str: uuid.substr(8, 8),
        uuid1724str: uuid.substr(16, 8),
        uuid2532str: uuid.substr(24, 8),
        motto:"读取完成!"
        })
    }
    )
  },

})
