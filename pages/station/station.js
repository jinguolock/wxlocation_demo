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
var intervalid;
var selectNodeId
var willsendbyte
var timeIndex
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
    //console.log("station onShow")
    let that = this;
    mypage = this;
    blueApi.searchBleDevices("IS");
    intervalid = setInterval(mypage.mytimeout, 1000);
    timeIndex = 0;
  },
  onHide: function () {
    console.log("onHide")
    clearInterval(intervalid)
    blueApi.stopSearch();
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  mytimeout:function(){
    var list = blueApi.getStationNameRssi();
        this.setData({
          findList: list
       })
    timeIndex++;
    if (timeIndex >= 60) {
      timeIndex = 0;
      blueApi.stopSearch();
      blueApi.searchBleDevices("IS");
    }
  },
  setMotto: function (str) {
    var obj = new Object();
    obj[selectNodeId] = str;
    mypage.setData({ motto: obj })
  },
  toStationcfg: function (e) {
    console.log("toStationcfg")
    clearInterval(intervalid)
    blueApi.stopSearch();
    selectNodeId = e.target.dataset.aid;


    wx.setStorageSync('configStationId', selectNodeId)
    wx.navigateTo({ url: "../mystationcfg/mystationcfg" })
  }



  //end method
})