
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var locationId
var sendInterval
var bleScan
var loraSf
var accThres
var sendTime
var battery
var hardware
var beaconMask
var sendIntervalarr = [2, 5, 10]
var bleScanarr = [160, 320, 512]
var loraSfarr = [7, 10, 11]
var accThresarr = [12, 28, 46]
var sendTimearr = [10, 30, 60]
var sendIntervalstrarr = ["2秒", "5秒", "10秒"]
var bleScanstrarr = ["快", "普通", "慢"]
var loraSfstrarr = ["近", "普通", "远"]
var accThresstrarr = ["灵敏", "普通", "不灵敏"]
var sendTimestrarr = ["10秒", "30秒", "60秒"]
Page({
  data: {
    deviceId: "",
    sendIntervalstr:"",
    bleScanstr: "",
    loraSfstr: "",
    accThresstr: "",
    sendTimestr: "",
    batterystr: "",
    hardwarestr: "",
    beaconstr: "",
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
  onLoad: function () {
    mypage = this
    mypage.setData({
      deviceId: wx.getStorageSync('configLocationId')
    })
    // var text = '123456';
    // var textBytes = aesjs.utils.utf8.toBytes(text);

    // // The counter is optional, and if omitted will begin at 1
    // var aesCtr = new aesjs.ModeOfOperation.ctr(aeskey, new aesjs.Counter(0));
    // var encryptedBytes = aesCtr.encrypt(textBytes);
    // console.log(encryptedBytes)
  },
  setMotto: function (str) {
    var obj = new Object();
    mypage.setData({ motto: str })
  },
  sendInterval_2: function (e) {
    mypage.setData({ sendIntervalstr: sendIntervalstrarr[0] })
    sendInterval = sendIntervalarr[0]
  },
  sendInterval_5: function (e) {
    mypage.setData({ sendIntervalstr: sendIntervalstrarr[1] })
    sendInterval = sendIntervalarr[1]
  },
  sendInterval_10: function (e) {
    mypage.setData({ sendIntervalstr: sendIntervalstrarr[2] })
    sendInterval = sendIntervalarr[2]
  },
  blescan_fast: function (e) {
    mypage.setData({ bleScanstr: bleScanstrarr[0] })
    bleScan = bleScanarr[0]
  },
  blescan_normal: function (e) {
    mypage.setData({ bleScanstr: bleScanstrarr[1] })
    bleScan = bleScanarr[1]
  },
  blescan_slow: function (e) {
    mypage.setData({ bleScanstr: bleScanstrarr[2] })
    bleScan = bleScanarr[2]
  },
  sf_short: function (e) {
    mypage.setData({ loraSfstr: loraSfstrarr[0] })
    loraSf = loraSfarr[0]
  },
  sf_normal: function (e) {
    mypage.setData({ loraSfstr: loraSfstrarr[1] })
    loraSf = loraSfarr[1]
  },
  sf_long: function (e) {
    mypage.setData({ loraSfstr: loraSfstrarr[2] })
    loraSf = loraSfarr[2]
  },
  acc_small: function (e) {
    mypage.setData({ accThresstr: accThresstrarr[0] })
    accThres = accThresarr[0]
  },
  acc_normal: function (e) {
    mypage.setData({ accThresstr: accThresstrarr[1] })
    accThres = accThresarr[1]
  },
  acc_long: function (e) {
    mypage.setData({ accThresstr: accThresstrarr[2] })
    accThres = accThresarr[2]
  },
  sendtime_10: function (e) {
    mypage.setData({ sendTimestr: sendTimestrarr[0] })
    sendTime = sendTimearr[0]
  },
  sendtime_30: function (e) {
    mypage.setData({ sendTimestr: sendTimestrarr[1] })
    sendTime = sendTimearr[1]
  },
  sendtime_60: function (e) {
    mypage.setData({ sendTimestr: sendTimestrarr[2] })
    sendTime = sendTimearr[2]
  },
  beacon_no: function (e) {
    mypage.setData({ beaconstr: "不过滤" })
    beaconMask = 0
  },
  beacon_yes: function (e) {
    mypage.setData({ sendTimestr: "过滤" })
    beaconMask = 0xFFFF
  },

  updateParameter: function (e) {

    if (sendInterval == null || bleScan == null || loraSf == null || accThres == null || sendTime==null){
      console.log("data error")
      mypage.setData({motto: "数据不完整!"});
      return;
    }
    myProcess.configParameter("IR"+mypage.data.deviceId, sendInterval, bleScan, loraSf, accThres, sendTime,beaconMask, function (msg){
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 
  },
 
  readParameter: function (e) {
    console.log(e.detail.value);
    console.log("readParameter");
    myProcess.syncParameter("IR" +mypage.data.deviceId, function (msg) {
      mypage.setMotto(msg)
    },function(arr){
      if(arr==null||arr.length!=19){
        console.log("error arr length:" + arr.length);
        return;
      }
      battery = ((arr[0] & 0xff) << 8) |(arr[1] & 0xff);
      battery = battery/1000;
      hardware = "V" + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString() + "." + (arr[4] & 0xff).toString()+"." + (arr[5] & 0xff).toString();
      loraSf = arr[6] & 0xff;
      sendInterval = arr[7] & 0xff;
      accThres = arr[8] & 0xff;
      sendTime = arr[10] & 0xff;
      bleScan = ((arr[11] & 0xff) << 8) | (arr[12] & 0xff);
      beaconMask = ((arr[15] & 0xff) << 8) | (arr[16] & 0xff);
      var sendIntervalIndex = mypage.getArrIndex(sendInterval, sendIntervalarr);
      var bleScanIndex = mypage.getArrIndex(bleScan, bleScanarr);
      var loraSfIndex = mypage.getArrIndex(loraSf, loraSfarr);
      var accThresIndex = mypage.getArrIndex(accThres, accThresarr);
      var sendTimeIndex = mypage.getArrIndex(sendTime, sendTimearr);
      mypage.setData({ 
        sendIntervalstr: sendIntervalIndex >= 0 ? sendIntervalstrarr[sendIntervalIndex] : "未知:" + sendInterval,
        bleScanstr: bleScanIndex >= 0 ? bleScanstrarr[bleScanIndex] : "未知:" + bleScan,
        loraSfstr: loraSfIndex >= 0 ? loraSfstrarr[loraSfIndex] : "未知:" + loraSf,
        accThresstr: accThresIndex >= 0 ? accThresstrarr[accThresIndex] : "未知:" + accThres,
        sendTimestr: sendTimeIndex >= 0 ? sendTimestrarr[sendTimeIndex] : "未知:" + sendTime,
        batterystr: battery.toString(),
        hardwarestr: hardware,
        beaconstr: beaconMask==0?"不过滤":"过滤",
        motto:"读取完成!"
        })
    }
    )
  },

})
