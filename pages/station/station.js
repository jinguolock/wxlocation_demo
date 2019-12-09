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
    //console.log("station onShow")
    let that = this;
    mypage = this;
    preId = "";
    blueApi.searchBleDevices("IS");
    intervalid = setInterval(mypage.mytimeout, 500);
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
  idFilterInputEvent: function (e) {
    preId = e.detail.value
  },
  mytimeout:function(){
    var list = blueApi.getStationNameRssi();
    if (preId != null && preId.length > 0) {
      var li = new Array();
      for (let i in list) {
        if (list[i].deviceName.indexOf(preId) == 2) {
          li.push(list[i]);
        }
      }
      this.setData({
        findList: li
      })
    } else {
      this.setData({
        findList: list
      })
    }
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
  },
  toStationadvcfg: function (e) {
    console.log("toStationadvcfg")
    clearInterval(intervalid)
    blueApi.stopSearch();
    selectNodeId = e.target.dataset.aid;


    wx.setStorageSync('configStationId', selectNodeId)
    wx.navigateTo({ url: "../mystationadvcfg/mystationadvcfg" })
  },


  //end method
})