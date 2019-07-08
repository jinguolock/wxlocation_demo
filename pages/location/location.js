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
    blueApi.searchBleDevices("IR");
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
  setMotto: function (str) {
    var obj = new Object();
    obj[selectNodeId] = str;
    mypage.setData({ motto: obj })
  },
  tocfg: function (e) {
    console.log("tocfg")
    clearInterval(intervalid)
    blueApi.stopSearch();
    selectNodeId = e.target.dataset.aid;
    wx.setStorageSync('configLocationId', selectNodeId)
    wx.navigateTo({ url: "../mycfg/mycfg" })
  },
   mytimeout: function () {
    var list = blueApi.getStationNames();
    this.setData({
      findList: list
    })
  },


  //end method
})