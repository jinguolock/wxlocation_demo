
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var beaconId
var pwdval=""
var setpwdval=""
var majorval =0
var minorval =0
var uuidval = ""
var rssival = 0
var txval = 0
var sendval = 1
var batteryval=0
var hardwareval = ""
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
    if (setpwdval == null || setpwdval.length == 0) {
      setpwdval = pwdval
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
  setpwdInputEvent: function (e) {
    setpwdval = e.detail.value
  },
  majorInputEvent: function (e) {
    majorval = e.detail.value
  },
  minorInputEvent: function (e) {
    minorval = e.detail.value
  },
  rssiInputEvent: function (e) {
    rssival = e.detail.value
  },
  txInputEvent: function (e) {
    txval = e.detail.value
  },
  sendInputEvent: function (e) {
    sendval = e.detail.value
  },
  
  setError:function (msg){
    mypage.setData({
      motto: msg
    })
  },
  updateParameter: function (e) {
    var major = parseInt(majorval, 10);
    var minor = parseInt(minorval, 10);
    var rssi = parseInt(rssival, 10);
    var tx = parseInt(txval, 10);
    var send = parseInt(sendval, 10);

    mypage.setData({ motto: "开始配置..." });
    if (isNaN(major)) {
      console.log("major error:" + major)
      mypage.setData({ motto: "major数据有误!" });
      return;
    }
    if (isNaN(minor)) {
      console.log("minor error:" + major)
      mypage.setData({ motto: "minor数据有误!" });
      return;
    }
    if (isNaN(rssi)) {
      console.log("rssi error:" + rssi)
      mypage.setData({ motto: "rssi数据有误!" });
      return;
    }
    if (isNaN(send)) {
      console.log("send error:" + send)
      mypage.setData({ motto: "发送周期数据有误!" });
      return;
    }
    if (isNaN(tx)) {
      console.log("tx error:" + tx)
      mypage.setData({ motto: "发送功率数据有误!" });
      return;
    }
    if (pwdval.length != 8 || setpwdval.length!=8){
      console.log("pwdval or setpwdval error:" + pwdval + ";" + setpwdval)
      mypage.setData({ motto: "密码或设置数据有误!" });
      return;
    }
    
    console.log("or rssi:" + rssi);
    console.log("or tx:" + tx);
    rssi = mypage.int2uint(rssi);
    tx=mypage.int2uint(tx);
    console.log("major:" + major);
    console.log("minor:" + minor);
    console.log("rssi:" + rssi);
    console.log("send:" + send);
    console.log("tx:" + tx);
    console.log("pwdval:" + pwdval);
    console.log("setpwdval:" + setpwdval);
    this.setError("开始配置");
    myProcess.configParameter_beacon(beaconId,pwdval, major, minor, rssi, send, tx, setpwdval, function (msg) {
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
        uuid += (arr[16+i] & 0xff).toString();
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
        majorstr: major+"",
        minorstr: minor+"",
        uuidstr: uuid,
        rssistr: rssi_level+"DBm",
        txstr: tx_power+"DBm",
        sendstr: adv_time+"毫秒",
        batterystr: battery+"V",
        hardwarestr: "V"+hardware,
        motto:"读取完成!"
        })
    }
    )
  },

})
