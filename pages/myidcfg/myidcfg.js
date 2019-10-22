
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var dtuId

var idval=""
var mystationId

Page({
  data: {
    deviceId: "",
    motto:""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getArrIndex: function (v,arr) {
    var vv=v;
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
    dtuId = wx.getStorageSync('configDeviceId')
    console.log("my deviceId:" + dtuId)
    idval = dtuId.substr(2);
    
    mypage.setData({
      deviceId: dtuId
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
  
  idInputEvent: function (e) {
    idval = e.detail.value
  },
  
  setError:function (msg){
    mypage.setData({
      motto: msg
    })
  },
  
  IDConfigHandler: function (e) {


    
    if (idval.length != 8) {
      mypage.setData({ motto: "ID字符数据有误!" });
      return;
    }

    console.log("idval:" + idval);
    
    this.setError("开始配置");
    // var runmodeval = 0
    // var loramodeval = 0
    // var channelval = 0
    // var sfval = ""
    // var powerval = 0
    // var baudval = 0
    // var sleepval = 1
    // var supportval = 0
    // var askval = ""
    //configParameter_dtu(deviceId, runmode, loramode, channel, sf, power, baud, sleep, support, ask, msgFunc, reFunc)
    myProcess.configParameter_dtuID(dtuId, idval, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    })
  },

})
