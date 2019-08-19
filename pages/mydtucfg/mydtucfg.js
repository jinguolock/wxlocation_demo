
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var dtuId
var pwdval=""
var setpwdval=""
var runmodeval =1
var loramodeval = 0
var channelval =0
var sfval = 12
var powerval = 0
var baudval = 0
var sleepval = 1
var supportval=0
var askval = ""
var mystationId
//0x78, 0x26, 0x66, 0x78, 0x33, 0x33, 0x78, 0x40, 0x00, 0x78, 0x4c, 0xcc, 0x78, 0x59, 0x99, 0x78, 0x66, 0x66, 0x78, 0x73, 0x33, 0x78, 0x80, 0x00
var freStrarr = ["782666", "783333", "784000", "784CCC", "785999", "786666", "787333", "788000"]
//1200,2400,4800,9600,14400,19200,28800,31250,38400,56000,57600,76800,115200
var baudarr = [1200, 2400, 4800, 9600, 14400, 19200, 28800, 31250, 38400, 56000, 57600, 76800, 115200];
Page({
  data: {
    deviceId: "",
    runmodestr:"",
    loramodestr: "",
    channelstr: "",
    sfstr: "",
    powerstr: "",
    baudstr: "",
    supportstr:"",
    sleepstr: "",
    askstr: "",
    hardwarestr:"",
    batterystr: "",
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
    dtuId = wx.getStorageSync('configDtuId')
    console.log("my dtuId:" + dtuId)
    
    
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
  btn_runmode_low: function (e) {
    mypage.setData({ runmodestr: "低功耗模式"})
    runmodeval = 1
  },
  btn_runmode_transfer: function (e) {
    mypage.setData({ runmodestr: "透传模式" })
    runmodeval = 2
  },
  btn_loramode_1278: function (e) {
    mypage.setData({ loramodestr: "定频模式" })
    loramodeval = 1
  },
  btn_loramode_1301: function (e) {
    mypage.setData({ loramodestr: "变频模式" })
    loramodeval = 2
  },
  btn_channel1: function (e) {
    mypage.setData({ channelstr: "1信道" })
    channelval = 0
  },
  btn_channel2: function (e) {
    mypage.setData({ channelstr: "2信道" })
    channelval = 1
  },
  btn_channel3: function (e) {
    mypage.setData({ channelstr: "3信道" })
    channelval = 2
  },
  btn_channel4: function (e) {
    mypage.setData({ channelstr: "4信道" })
    channelval = 3
  },
  btn_channel5: function (e) {
    mypage.setData({ channelstr: "5信道" })
    channelval = 4
  },
  btn_channel6: function (e) {
    mypage.setData({ channelstr: "6信道" })
    channelval = 5
  },
  btn_sf7: function (e) {
    mypage.setData({ sfstr: "扩频7" })
    sfval = 7
  },
  btn_sf8: function (e) {
    mypage.setData({ sfstr: "扩频8" })
    sfval = 8
  },
  btn_sf9: function (e) {
    mypage.setData({ sfstr: "扩频9" })
    sfval = 9
  },
  btn_sf10: function (e) {
    mypage.setData({ sfstr: "扩频10" })
    sfval = 10
  },
  btn_sf11: function (e) {
    mypage.setData({ sfstr: "扩频11" })
    sfval = 11
  },
  btn_sf12: function (e) {
    mypage.setData({ sfstr: "扩频12" })
    sfval = 12
  },
  powerInputEvent:function(e){
    powerval=e.detail.value
  },
  baudInputEvent: function (e) {
    baudval = e.detail.value
  },
  sleepInputEvent: function (e) {
    sleepval = e.detail.value
  },
  supportInputEvent: function (e) {
    supportval = e.detail.value
  },
  askInputEvent: function (e) {
    askval = e.detail.value
  },
  
  
  setError:function (msg){
    mypage.setData({
      motto: msg
    })
  },
  updateParameter: function (e) {

    
    var power = parseInt(powerval, 10);
    var baudNum = parseInt(baudval, 10);
    var baud = mypage.getArrIndex(baudNum, baudarr);
    var sleep = parseInt(sleepval, 10);
    var support = parseInt(supportval, 10);

    mypage.setData({ motto: "开始配置..." });
    if (isNaN(power)||power<0||power>17) {
      console.log("power error:" + power)
      mypage.setData({ motto: "发射功率数据有误!" });
      return;
    }
    if (isNaN(baudNum)||baud<0) {
      console.log("baud error:" + baud)
      mypage.setData({ motto: "波特率数据有误!" });
      return;
    }
    if (isNaN(sleep) || sleep < 0) {
      console.log("sleep error:" + sleep)
      mypage.setData({ motto: "休眠时间数据有误!" });
      return;
    }
    if (isNaN(support) || support < 0 || support > 255) {
      console.log("support error:" + send)
      mypage.setData({ motto: "供电时间数据有误!" });
      return;
    }
    if (askval.length == 0){
      if(runmodeval==1){
        console.log("askval error:" + askval)
        mypage.setData({ motto: "低功耗模式轮询字符数据有误!" });
        return;
      }else{
        askval="01 03 00 00 00 02 C4 0B";
      }
    }
    
    console.log("runmodeval:" + runmodeval);
    console.log("loramodeval:" + loramodeval);
    console.log("channelval:" + channelval);
    console.log("sfval:" + sfval);
    console.log("freStrarr[channelval]:" + freStrarr[channelval]);
    console.log("power:" + power);
    console.log("baud:" + baud);
    console.log("sleep:" + sleep);
    console.log("support:" + support);
    console.log("askval:" + askval);
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
    myProcess.configParameter_dtu(dtuId, runmodeval, loramodeval, freStrarr[channelval], sfval, power, baud, sleep, support, askval, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 
  },
  readParameter: function (e) {
    mypage.setData({ motto: "开始读取..." });
    console.log(e.detail.value);
    console.log("readParameter");
    myProcess.syncParameter_dtu(dtuId, function (msg) {
      mypage.setMotto(msg)
    },function(arr){
      console.log(arr);
      if(arr==null||arr.length<20){
        console.log("error arr length:" + arr.length);
        return;
      }

      var battery = ((arr[0] & 0xff) << 8) | (arr[1] & 0xff);
      battery = battery / 1000;
      var hardware = "V" + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString() + "." + (arr[4] & 0xff).toString() + "." + (arr[5] & 0xff).toString();

      var timeInterval = ((arr[9] & 0xff) << 24) | ((arr[8] & 0xff)<<16) | ((arr[7] & 0xff) << 8) | (arr[6] & 0xff);
      var fre ="";
      for (var i = 0; i < 3; i++) {
        var hex = (arr[10+i] & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        fre+=hex;
      }
      var freIndex = mypage.getArrIndex(fre, freStrarr);
      var sf = arr[13] & 0xff;
      var power = arr[14] & 0xff;
      var loramode=arr[15]&0xff;
      var runmode = arr[16] & 0xff;
      var baud = arr[17] & 0xff;
      var support = arr[18] & 0xff;
      var asknum = arr[19] & 0xff;
      var asklen = new Array(asknum);
      var askbs = new Array(asknum);
      var ptr=20+asknum;
      for(var i=0;i<asknum;i++){
        asklen[i]=arr[20+i]&0xff;
        if (asklen[i]>0){
          var tt = "";
          for (var j = 0; j < asklen[i]; j++) {
            var hex = (arr[ptr] & 0xff).toString(16);
            hex = (hex.length === 1) ? '0' + hex : hex;
            tt = tt + hex + " ";
            ptr++;
          }
          askbs[i] = tt.substr(0, tt.length - 1);
        }else{

        }
        
      }

      
      console.log("battery:" + battery);
      console.log("timeInterval:" + timeInterval);
      console.log("fre:" + fre);
      console.log("freIndex:" + freIndex);
      console.log("sf:" + sf);
      console.log("power:" + power);
      console.log("loramode:" + loramode);
      console.log("baud:" + baud);
      console.log("support:" + support);
      console.log("asknum:" + asknum);
      for (var i = 0; i < asknum; i++) {
        console.log("ask " + i + " len:" + asklen[i]);
        console.log("ask " + i + " bs:" + askbs[i]);
      }
      var rms = "";
      if (runmode == 1) {
        rms = "低功耗模式";
      } else {
        rms = "透传模式";
      }
      var lms = "";
      if (loramode == 1) {
        lms = "变频模式";
      } else {
        lms = "定频模式";
      }
      
      mypage.setData({ 
        runmodestr: rms,
        loramodestr: lms,
        channelstr: (freIndex+1)+"信道",
        sfstr: "扩频"+sf,
        powerstr: power+"DBm",
        baudstr: baudarr[baud],
        supportstr: support + "秒",
        sleepstr: (timeInterval/1000) + "秒",
        askstr: askbs[0],
        batterystr: battery+"V",
        hardwarestr: "V"+hardware,
        motto:"读取完成!"
        })
    }
    )
  },

})
