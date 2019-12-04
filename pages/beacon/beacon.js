var util = require('../../utils/util');
var blueApi = require('../../utils/ble.js').Ble;
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;

const app = getApp()
var mypage
var selectApartment
var selectAuthId
var authapps
var authappMap = new Object()
var userPhone
var userPwd
var flag = 0
var lockPwd
var lockVersion
var lockSn
var lockinfo
var locklist
var selectNodeId
var willsendbyte
var intervalid
var timeIndex
var preId
Page({
  data: {
    motto: "",
    findList: null,
    lockName: '',
    lockDesc: '',
    motto: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: []

  },
  onShow: function () {
    console.log("location onShow")
    let that = this;
    mypage = this;
    preId="";
    blueApi.searchBleDevices2("IB","IR");

    //blueApi.searchBleDevicesBeacon()
   // blueApi.searchBeacon()

    timeIndex = 0;
    intervalid = setInterval(mypage.mytimeout, 1000);
  },
  onHide: function () {
    console.log("onHide")
    clearInterval(intervalid)
    blueApi.stopSearch();
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    mypage = this;
    // myApi.webmain("datalist", "lock_node", null, function (obj) {
    //   console.log(obj)
    //   locklist = obj

    //   that.setData({
    //     findList: locklist
    //   })
    //   // that.setMotto("ok")
    // })

  },
  idFilterInputEvent: function (e) {
    preId = e.detail.value
  },
  setMotto: function (str) {
    var obj = new Object();
    obj[selectNodeId] = str;
    mypage.setData({ motto: obj })
  },
  tocfg: function (e) {

    clearInterval(intervalid)
    blueApi.stopSearch();
    selectNodeId = e.target.dataset.aid;
    console.log("tocfg,nodeId:" + selectNodeId)
    wx.setStorageSync('configBeaconId', selectNodeId)
    wx.navigateTo({ url: "../mybeaconcfg/mybeaconcfg" })
  },
  touuidcfg: function (e) {

    clearInterval(intervalid)
    blueApi.stopSearch();
    selectNodeId = e.target.dataset.aid;
    console.log("tocfg,nodeId:" + selectNodeId)
    wx.setStorageSync('configBeaconId', selectNodeId)
    wx.navigateTo({ url: "../mybeaconuuidcfg/mybeaconuuidcfg" })
  },
  mytimeout: function () {
    var list = blueApi.getStationNameRssi();
    if (preId != null && preId.length>0){
      var rssi = parseInt(preId, 10);
      if (!(isNaN(rssi))) {
        var li = new Array();
        for (let i in list) {
          var deviceRssi = parseInt(list[i].rssi, 10);
          if (!(isNaN(deviceRssi)) && (deviceRssi>rssi)) {
            li.push(list[i]);
          }
        }
        this.setData({
          findList: li
        })
      }
      
    }else{

      // for (let i in list) {
      //   var mstr = list[i].deviceName.substr(0, 4)
      //   var jstr = list[i].deviceName.substr(4, 4)
        
      //   var mv=myProcess.getHexByStr2(mstr)
      //   var jv = myProcess.getHexByStr2(jstr)
      //   list[i].major = ((mv[0] & 0xff) << 8) | (mv[1] & 0xff);
      //   list[i].minor = ((jv[0] & 0xff) << 8) | (jv[1] & 0xff);
      // }

      this.setData({
        findList: list
      })
    }
    
    
    timeIndex++;
    if (timeIndex >= 60) {
      timeIndex = 0;
      blueApi.stopSearch();
      blueApi.searchBleDevices2("IB", "IR");
     // blueApi.searchBleDevicesBeacon();
    }
  },


  //end method
})