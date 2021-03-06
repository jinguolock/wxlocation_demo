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
    preId = "";
    blueApi.searchBleDevicesAll();
    timeIndex = 0;
    intervalid = setInterval(mypage.mytimeout, 500);
  },
  onHide: function () {
    console.log("onHide")
    clearInterval(intervalid)
    blueApi.stopSearch();
  },
  onUnload: function (options) {
    console.log("onUnload")
    clearInterval(intervalid)
    blueApi.stopSearch();
  },
  onLoad: function (options) {
    console.log("onLoad")
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    mypage = this;
    preId = "";
    blueApi.searchBleDevicesAll();
    timeIndex = 0;
    intervalid = setInterval(mypage.mytimeout, 500);

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
    wx.setStorageSync('configDeviceId', selectNodeId)
    wx.navigateTo({ url: "../myidcfg/myidcfg" })
  },
  mytimeout: function () {
    var list = blueApi.getStationNameRssi();
    if (preId != null && preId.length > 0) {
      var rssi = parseInt(preId, 10);
      if (!(isNaN(rssi))) {
        var li = new Array();
        for (let i in list) {
          var deviceRssi = parseInt(list[i].rssi, 10);
          if (!(isNaN(deviceRssi)) && (deviceRssi > rssi)) {
            li.push(list[i]);
          }
        }
        this.setData({
          findList: li
        })
      }
      //  var li = new Array();
      //  for (let i in list) {
      //    if (list[i].deviceName.indexOf(preId) == 2) {
      //      li.push(list[i]);
      //    }
      //  }
      //  this.setData({
      //    findList: li
      //  })
    } else {
      this.setData({
        findList: list
      })
    }
    timeIndex++;
    if (timeIndex >= 60) {
      timeIndex = 0;
      blueApi.stopSearch();
      blueApi.searchBleDevicesAll();
    }
  },


  //end method
})