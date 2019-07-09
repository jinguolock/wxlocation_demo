
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var locationId
var sendInterval
var sendTime
var battery
var hardware
var beaconMask
var beaconValue

Page({
  data: {
    deviceId: "",
    sendIntervalstr:"",
    sendTimestr: "",
    batterystr: "",
    hardwarestr: "",
    maskstr: "",
    alarmstr: "",
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
  onShow: function () {
    //console.log("station onShow")
    let that = this;
    mypage = this;
    //blueApi.searchBleDevices();
    // intervalid = setInterval(mypage.mytimeout, 1000);
    locationId = wx.getStorageSync('configLocationId')
    console.log("my locationId:" + locationId)
    mypage.setData({
      deviceId: locationId
    })
  },
  onLoad: function () {
    mypage = this
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
  sendIntervalInputEvent: function (e) {
    sendInterval = e.detail.value
  },
  sendTimeInputEvent: function (e) {
    sendTime = e.detail.value
  },
  filterMaskInputEvent: function (e) {
    beaconMask = e.detail.value
  },
  filterValueInputEvent: function (e) {
    beaconValue = e.detail.value
  },
  updateParameter: function (e) {

    if (sendInterval == null || sendTime == null || beaconMask == null || beaconValue == null ){
      console.log("data error")
      mypage.setData({motto: "数据不完整!"});
      return;
    }
    var sendIntVal = parseInt(sendInterval,10);
    var sendTimeVal = parseInt(sendTime, 10);
    var beaconMaskVal = parseInt(beaconMask, 16);
    var beaconValueVal = parseInt(beaconValue, 16);
    if(!(sendIntVal>2)){
      console.log("sendIntVal error:" + sendIntVal)
      mypage.setData({ motto: "发送间隔数据有误!" });
      return;
    }
    if (!(sendTimeVal > 5)) {
      console.log("sendTimeVal error:" + sendTimeVal)
      mypage.setData({ motto: "静止发送时间数据有误!" });
      return;
    }
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
    myProcess.configParameter2(locationId, sendIntVal, sendTimeVal, beaconMaskVal, beaconValueVal, function (msg){
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 
  },
 
  readParameter: function (e) {
    console.log("readParameter:" + locationId);
    myProcess.syncParameter(locationId, function (msg) {
      mypage.setMotto(msg)
    },function(arr){
      if(arr!=null&&arr.length==19){
        var battery = ((arr[0] & 0xff) << 8) | (arr[1] & 0xff);
        battery = battery / 1000;
        var hardware = "V" + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString() + "." + (arr[4] & 0xff).toString() + "." + (arr[5] & 0xff).toString();
        var loraSf = arr[6] & 0xff;
        var sendInterval = arr[7] & 0xff;
        var accThres = arr[8] & 0xff;
        var sendTime = arr[10] & 0xff;
        var bleScan = ((arr[11] & 0xff) << 8) | (arr[12] & 0xff);
        var beaconMask = ((arr[15] & 0xff) << 8) | (arr[16] & 0xff);
        var beaconValue = ((arr[17] & 0xff) << 8) | (arr[18] & 0xff);
        mypage.setData({
          sendIntervalstr: sendInterval+"秒",
          sendTimestr: sendTime+"秒",
          batterystr: battery+"V",
          hardwarestr: hardware,
          maskstr:"0x"+ beaconMask,
          beaconstr: "0x"+ beaconValue,
          motto: "读取完成!"
        })
      } else if(arr != null && arr.length == 23){
        var battery = ((arr[0] & 0xff) << 8) | (arr[1] & 0xff);
        battery = battery / 1000;
        var hardware = "V" + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString() + "." + (arr[4] & 0xff).toString() + "." + (arr[5] & 0xff).toString();
        var loraSf = arr[6] & 0xff;
        var sendInterval = arr[7] & 0xff;
        var accThres = arr[8] & 0xff;
        var sendTime = arr[10] & 0xff;
        var bleScan = ((arr[11] & 0xff) << 8) | (arr[12] & 0xff);
        var beaconMask = ((arr[15] & 0xff) << 8) | (arr[16] & 0xff);
        var beaconValue = ((arr[17] & 0xff) << 8) | (arr[18] & 0xff);
        var alarmNum = ((arr[22] & 0xff) << 24) | ((arr[21] & 0xff) << 16) || ((arr[20] & 0xff) << 8) || (arr[19] & 0xff);
        mypage.setData({
          sendIntervalstr: sendInterval + "秒",
          sendTimestr: sendTime + "秒",
          batterystr: battery + "V",
          hardwarestr: hardware,
          maskstr: "0x" + beaconMask.toString(16),
          beaconstr: "0x" + beaconValue.toString(16),
          alarmstr: alarmNum+"次",
          motto: "读取完成!"
        })
      }else{
        console.log("error arr length:" + arr.length);
        return;
      }
      
    }
    )
  },

})
