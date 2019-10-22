
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var locationId
var intervalval
var onlineval 
var maskval="0"
var valueval="8877"
var beaconval
var resetval
var mystationId

var staticStrarr = ["未知","动态", "静态"]
var tcpStrarr = ["unkown","UDP", "TCP"]

Page({
  data: {
    deviceId: "",
    intervalstr:"",
    onlinestr: "",
    maskstr: "",
    valuestr: "",
    beaconstr: "",
    resetstr:"",
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
    mystationId = wx.getStorageSync('configStationId')
    console.log("my stationid:" + mystationId)
    mypage.setData({
      deviceId: mystationId
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
  openBeacon: function (e) {
    mypage.setData({ beaconstr: "启用"})
    beaconval = 1
  },
  closeBeacon: function (e) {
    mypage.setData({ beaconstr: "禁用" })
    beaconval = 0
  },
  intervalInputEvent:function(e){
    intervalval=e.detail.value
  },
  onlineInputEvent: function (e) {
    onlineval = e.detail.value
  },
  resetInputEvent: function (e) {
    resetval = e.detail.value
  },
  maskInputEvent: function (e) {
    maskval = e.detail.value
  },
  valueInputEvent: function (e) {
    valueval = e.detail.value
  },
  
  setError:function (msg){
    mypage.setData({
      motto: msg
    })
  },
  updateParameter: function (e) {
    mypage.setData({ motto: "开始配置..." });
    if (beaconval != 1 && beaconval != 0) {
      this.setError("没有选择透传模式！")
      return
    }
    var beaconMaskVal = parseInt(maskval, 16);
    var beaconValueVal = parseInt(valueval, 16);
    if(beaconval==1){
      if (isNaN(beaconMaskVal)) {
        console.log("beaconMaskVal error:" + beaconMaskVal)
        mypage.setData({ motto: "过滤掩码数据有误!" });
        return;
      }
      if (isNaN(beaconValueVal)) {
        console.log("beaconValueVal error:" + beaconValue)
        mypage.setData({ motto: "过滤值数据有误!" });
        return;
      }
    }else{
      if (isNaN(beaconMaskVal)) {
        beaconMaskVal=0
      }
      if (isNaN(beaconValueVal)) {
        beaconMaskVal=0x8877
      }
    }
    var intervalvalVal = parseInt(intervalval, 10);
    var resetvalVal = parseInt(resetval, 10);
    var onlinevalVal = parseInt(onlineval, 10);
    if (isNaN(intervalvalVal)) {
      console.log("intervalval error:" + intervalval)
      mypage.setData({ motto: "发送间隔有误!" });
      return;
    }
    if (isNaN(onlinevalVal) || onlinevalVal<0) {
      console.log("onlineval error:" + onlineval)
      mypage.setData({ motto: "在线阈值有误!" });
      return;
    } 
    if (isNaN(resetvalVal) || resetvalVal < 0) {
      console.log("resetvalVal error:" + resetvalVal)
      mypage.setData({ motto: "重启超时有误!" });
      return;
    } 
    this.setError("开始配置");
    myProcess.configParameter_stationAdv(mystationId, intervalvalVal, onlinevalVal, beaconMaskVal, beaconValueVal, beaconval, resetvalVal, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 
  },
 
  readParameter: function (e) {
    mypage.setData({ motto: "开始读取..." });
    console.log(e.detail.value);
    console.log("readParameter");
    myProcess.syncParameter_station_adv(mystationId, function (msg) {
      mypage.setMotto(msg)
    },function(arr){
      console.log(arr);
      if(arr==null||arr.length<10){
        console.log("error arr length:" + arr.length);
        return;
      }

      var beaconMask = ((arr[0] & 0xff) << 8) | (arr[1] & 0xff);
      var beaconValue = ((arr[2] & 0xff) << 8) | (arr[3] & 0xff);
      var interval = ((arr[4] & 0xff) << 24) | ((arr[5] & 0xff) << 16) | ((arr[6] & 0xff) << 8) | (arr[7] & 0xff);
      var beaconEnable = (arr[8] & 0xff);
      var onlineThreshold = (arr[9] & 0xff);
      var reset = ((arr[10] & 0xff) << 24) | ((arr[11] & 0xff) << 16) | ((arr[12] & 0xff) << 8) | (arr[13] & 0xff);
     
      
      console.log("beaconMask:" + beaconMask);
      console.log("beaconValue:" + beaconValue);
      console.log("interval:" + interval);
      console.log("beaconEnable:" + beaconEnable);
      console.log("onlineThreshold:" + onlineThreshold);
      console.log("reset:" + reset);
      
      intervalval = interval + ""
      onlineval = onlineThreshold + ""
      maskval = beaconMask.toString(16)
      valueval = beaconValue.toString(16)
      beaconval=beaconEnable
      resetval = reset
      mypage.setData({ 
        intervalstr: intervalval,
        onlinestr: onlineval,
        beaconstr: beaconval == 0 ?  "禁用":"启用",
        maskstr: "0x" + maskval,
        valuestr: "0x" + valueval,
        resetstr: resetval+"秒",
        motto:"读取完成!"
        })
    }
    )
  },
  toDfu: function (e) {
    mypage.setData({ motto: "等待进入DFU..." });

    myProcess.configToDfu_station(mystationId, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "DFU等待升级!" });
    })
  },

})
