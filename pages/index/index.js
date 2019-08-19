//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util');

Page({
  data: {
    banner: null,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    txtAds: null,
    isclient: true,
    advertise: null
  },
  /*
  * 首页banner
  */
  setBanner: function () {
    let that = this;
    that.setData({
      banner: [{ "id": 78, "title": "\u8f66\u6e90\u5b9d\u7cbe\u9009\u8f66", "image": "http://www.jinjufocus.com/images/gateway3.jpg", "type": 1, "target": "https:\/\/h5.cyb.kuaiqiangche.com\/special\/activitySpecialDetail.html?id=13&v=0918&_source=banner_20171113", "target_id": 0 }]
    });
  },
  /**
   * 首页文字广告
   */
  setTxtAds: function(){
    let that = this;
    that.setData({
      txtAds: []
    });
  },
  /**
   * 首页两块子banner
   */
  setSubBanner: function(){
    let that = this;
    that.setData({
      advertise: [{ "image": "http:\/\/www.jinjufocus.com\/images\/gateway3.jpg", "type": 2, "target": 3950955 }, { "image": "https:\/\/image.kuaiqiangche.com\/data\/attachment\/2018-07-03\/1530589499134884.jpg", "type": 2, "target": 3950987 }]
    });
  },
  /**
   * 模块入口
   */
  setModule: function(){

  },
  /**
   * 入口
   */
  onLoad: function () {
    var that = this;
    //wx.navigateTo({ url: "" })
    that.setBanner();
    that.setTxtAds();
    that.setSubBanner();
    that.setModule();
  },
  toStationCfg:function(){
    //wx.navigateTo({ url: "index" })
    wx.switchTab({ url: "../station/station" })
  },
  toLocationCfg: function () {
    wx.switchTab({ url: "../location/location" })
  },
  toBeaconCfg: function () {
    wx.navigateTo({ url: "../beacon/beacon" })
   // wx.navigateTo({ url: "../mycfg/mycfg" })
    
  },
  todtuCfg: function () {
   // wx.navigateTo({ url: "../mydtucfg/mydtucfg" })
    wx.navigateTo({ url: "../dtu/dtu" })
     //wx.navigateTo({ url: "../mycfg/mycfg" })

  }
});