
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var beaconId
var pwdval = ""
var setpwdval = ""
var majorval 
var minorval 
var uuidval = ""
var rssival 
var txval 
var sendval 
var batteryval 
var hardwareval = ""
var mystationId

var readmajor ;
var readminor ;
var readrssi ;
var readtx ;
var readsend ;
var staticStrarr = ["未知", "动态", "静态"]
var tcpStrarr = ["unkown", "UDP", "TCP"]

Page({
  data: {
    deviceId: "",
    majorstr: "",
    minorstr: "",
    uuidstr: "",
    rssistr: "",
    txstr: "",
    sendstr: "",
    batterystr: "",
    hardwarestr: "",
    usePwd:"",
    motto: ""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getArrIndex: function (v, arr) {
    var vv = v + 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == vv) {
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
    beaconId = wx.getStorageSync('configBeaconId')
    var up = wx.getStorageSync('configBeaconPwd')
    
    console.log("my beaconId:" + beaconId)
    if (pwdval == null || pwdval.length == 0) {
      // pwdval = beaconId
      pwdval = beaconId.substr(2)
    }
    

    if (up != null && up.length > 0) {
      mypage.setData({
        usePwd: up
      })
      pwdval=up
    }else{
      mypage.setData({
        usePwd: beaconId.substr(2)
      })
    }

    if (setpwdval == null || setpwdval.length == 0) {
      setpwdval = pwdval
    }

    mypage.setData({
      deviceId: beaconId
    })
    this.getParameter()
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
  sendstatic: function (e) {
    mypage.setData({ staticipstr: "静态" })
    staticipval = 1
  },
  senddhcp: function (e) {
    mypage.setData({ staticipstr: "动态" })
    staticipval = 2
  },
  pwdInputEvent: function (e) {
    pwdval = e.detail.value
    wx.setStorageSync('configBeaconPwd', pwdval)
    if (pwdval != null && pwdval.length > 0) {
      
      mypage.setData({
        usePwd: pwdval
      })
    } else {
      pwdval = beaconId.substr(2)
      mypage.setData({
        usePwd: beaconId.substr(2)
      })
    }
  },
  setpwdInputEvent: function (e) {
    setpwdval = e.detail.value
  },
  majorInputEvent: function (e) {
    majorval = e.detail.value
  },
  minorInputEvent: function (e) {
    minorval = e.detail.value
  },
  rssiInputEvent: function (e) {
    rssival = e.detail.value
  },
  txInputEvent: function (e) {
    txval = e.detail.value
  },
  sendInputEvent: function (e) {
    sendval = e.detail.value
  },

  setError: function (msg) {
    mypage.setData({
      motto: msg
    })
  },
  updateParameter: function (e) {
    // readmajor = major + "";
    // readminor = minor + "";
    // readrssi = rssi_level + "";
    // readtx = tx_power + "";
    // readsend = adv_time + "";
    if (majorval == null ||myProcess.trim(majorval).length==0){
      console.log("major is null,use:" + readmajor);
      majorval = readmajor;
    }
    if (minorval == null || myProcess.trim(minorval).length == 0) {
      console.log("minor is null,use:" + readminor);
      minorval = readminor;
    }
    if (rssival == null || myProcess.trim(rssival).length == 0) {
      console.log("rssi is null,use:" + readrssi);
      rssival = readrssi;
    }
    if (txval == null || myProcess.trim(txval).length == 0) {
      console.log("tx is null,use:" + readtx);
      txval = readtx;
    }
    if (sendval == null || myProcess.trim(sendval).length == 0) {
      console.log("tx is null,use:" + readsend);
      sendval = readsend;
    }
    var major = parseInt(majorval, 10);
    var minor = parseInt(minorval, 10);
    var rssi = parseInt(rssival, 10);
    var tx = parseInt(txval, 10);
    var send = parseInt(sendval, 10);

    mypage.setData({ motto: "开始配置..." });
    if (isNaN(major) || majorval == null || majorval.length==0) {
      console.log("major error:" + major)
      mypage.setData({ motto: "major数据有误!" });
      return;
    }
    if (isNaN(minor) || minorval == null || minorval.length == 0) {
      console.log("minor error:" + major)
      mypage.setData({ motto: "minor数据有误!" });
      return;
    }
    if (isNaN(rssi) || rssival == null || rssival.length == 0) {
      console.log("rssi error:" + rssi)
      mypage.setData({ motto: "rssi数据有误!" });
      return;
    }
    if (isNaN(send) || sendval == null || sendval.length == 0) {
      console.log("send error:" + send)
      mypage.setData({ motto: "发送周期数据有误!" });
      return;
    }
    if (isNaN(tx) || txval == null || txval.length == 0) {
      console.log("tx error:" + tx)
      mypage.setData({ motto: "发送功率数据有误!" });
      return;
    }
    if (pwdval.length != 8 || setpwdval.length != 8) {
      console.log("pwdval or setpwdval error:" + pwdval + ";" + setpwdval)
      mypage.setData({ motto: "密码或设置数据有误!" });
      return;
    }

    console.log("or rssi:" + rssi);
    console.log("or tx:" + tx);
    rssi = mypage.int2uint(rssi);
    tx = mypage.int2uint(tx);
    console.log("major:" + major);
    console.log("minor:" + minor);
    console.log("rssi:" + rssi);
    console.log("send:" + send);
    console.log("tx:" + tx);
    console.log("pwdval:" + pwdval);
    console.log("setpwdval:" + setpwdval);
    this.setError("开始配置");
    myProcess.configParameter_beacon(beaconId, pwdval, major, minor, rssi, send, tx, setpwdval, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    })
    // myProcess.configParameter_stationNet(mystationId, ipval, maskval, gatewayval, dnsval, sendtoval, staticipval, function (msg) {
    //   mypage.setMotto(msg)
    // }, function (arr) {
    //   mypage.setData({ motto: "配置完成!" });
    // }) 


    // if (sendInterval == null || bleScan == null || loraSf == null || accThres == null || sendTime==null){
    //   console.log("data error")
    //   mypage.setData({motto: "数据不完整!"});
    //   return;
    // }
    // myProcess.configParameter(mypage.data.deviceId, sendInterval, bleScan, loraSf, accThres, sendTime,beaconMask, function (msg){
    //   mypage.setMotto(msg)
    // }, function (arr) {
    //   mypage.setData({ motto: "配置完成!" });
    // }) 
  },
  uint2int: function (num) {
    if (num > 0xff / 2) {
      var a = ~0xff;
      num = num | a;
    }
    return num;
  },
  int2uint: function (num) {
    if (num < 0) {
      num = num & 0xff;
    }
    return num;
  },
  readParameter: function (e) {
    this.getParameter()
  },
  getParameter:function(){
    if (pwdval.length != 8) {
      console.log("pwdval error:" + pwdval)
      mypage.setData({ motto: "密码数据有误!" });
      return;
    }
    mypage.setData({ motto: "开始读取..." });
    console.log("readParameter");
    myProcess.syncParameter_beacon(beaconId, pwdval, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      console.log(arr);
      if (arr == null || arr.length < 32) {
        console.log("error arr length:" + arr.length);
        return;
      }

      var battery = ((arr[0] & 0xff) << 8) | (arr[1] & 0xff);
      battery = battery / 1000;
      var hardware = "V" + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString() + "." + (arr[4] & 0xff).toString() + "." + (arr[5] & 0xff).toString();
      var sendInterval = ((arr[6] & 0xff) << 8) | (arr[7] & 0xff);
      var adv_time = ((arr[8] & 0xff) << 8) | (arr[9] & 0xff);
      var major = ((arr[10] & 0xff) << 8) | (arr[11] & 0xff);
      var minor = ((arr[12] & 0xff) << 8) | (arr[13] & 0xff);
      var rssi_level = mypage.uint2int(arr[14] & 0xff);
      var tx_power = mypage.uint2int(arr[15] & 0xff);
      var uuid = "";
      for (var i = 0; i < 16; i++) {
        uuid += (arr[16 + i] & 0xff).toString();
      }
      console.log("battery:" + battery);
      console.log("hardware:" + hardware);
      console.log("sendInterval:" + sendInterval);
      console.log("adv_time:" + adv_time);
      console.log("major:" + major);
      console.log("minor:" + minor);
      console.log("rssi_level:" + rssi_level);
      console.log("tx_power:" + tx_power);
      console.log("uuid:" + uuid);

      readmajor = major + "";
      readminor = minor + "";
      readrssi = rssi_level+"";
      readtx = tx_power+"";
      readsend = adv_time+"";

      mypage.setData({
        majorstr: major + "",
        minorstr: minor + "",
        uuidstr: uuid,
        rssistr: rssi_level + "DBm",
        txstr: tx_power + "DBm",
        sendstr: adv_time + "毫秒",
        batterystr: battery + "V",
        hardwarestr: "V" + hardware,
        motto: "读取完成!"
      })
    }
    )
  }

})
