
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
var thresValue
var cancelValue
var advIntervalValue
var loraenableValue=1
var cancelAlarmValue=10
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
    thresstr:"",
    cancelalarmstr:"",
    advIntervalstr:"",
    loraenablestr:"",
    runmodestr:"",
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
  autocancel: function (e) {
    mypage.setData({ cancelalarmstr: "发送" + cancelAlarmValue + "次后取消" })
    cancelValue = 2
  },
  manulcancel: function (e) {
    mypage.setData({ cancelalarmstr: "连按5下取消" })
    cancelValue = 1
  },
  nocancel: function (e) {
    mypage.setData({ cancelalarmstr: "无法取消" })
    cancelValue = 0
  },
  loradisable: function (e) {
    mypage.setData({ loraenablestr: "LORA禁用" })
    loraenableValue = 0
  },
  loraenable: function (e) {
    mypage.setData({ loraenablestr: "LORA启用" })
    loraenableValue = 1
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
  thresValueInputEvent: function (e) {
    thresValue = e.detail.value
  },
  advIntervalInputEvent: function (e) {
    advIntervalValue = e.detail.value
  },
  updateParameter_tomode2: function (e) {
    mypage.setData({ motto: "开始配置..." });
    
    myProcess.configParameter_tomode(locationId, 2, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    })
  },
  updateParameter_tomode4: function (e) {
    mypage.setData({ motto: "开始配置..." });

    myProcess.configParameter_tomode(locationId, 4, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    })
  },
  updateParameter_tomode3: function (e) {
    mypage.setData({ motto: "开始配置..." });

    myProcess.configParameter_tomode(locationId, 3, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    })
  },
  updateParameter: function (e) {
    mypage.setData({ motto: "开始配置..." });
    if (sendInterval == null || sendTime == null || beaconMask == null || beaconValue == null ){
      console.log("data error")
      mypage.setData({motto: "数据不完整!"});
      return;
    }
    var sendIntVal = parseInt(sendInterval,10);
    var sendTimeVal = parseInt(sendTime, 10);
    var beaconMaskVal = parseInt(beaconMask, 16);
    var beaconValueVal = parseInt(beaconValue, 16);
    var thresValueVal = parseInt(thresValue, 10); 
    var advIntervalVal = parseInt(advIntervalValue, 10); 
    if(!(sendIntVal>1)){
      console.log("sendIntVal error:" + sendIntVal)
      mypage.setData({ motto: "发送间隔数据有误!" });
      return;
    }
    if (!(sendTimeVal > 4)) {
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
    if (isNaN(thresValueVal)) {
      console.log("beaconValueVal error:" + beaconValue)
      mypage.setData({ motto: "动静数据有误!" });
      return;
    }
   
    if (thresValueVal < 2 || thresValueVal>30) {
      console.log("beaconValueVal error:" + beaconValue)
      mypage.setData({ motto: "动静数据大小有误，2~30之间!" });
      return;
    }
    if (isNaN(advIntervalVal)) {
      console.log("advIntervalVal error:" + advIntervalVal)
      mypage.setData({ motto: "广播数据有误!" });
      return;
    }
    if (advIntervalVal < 20) {
      console.log("advIntervalVal error:" + advIntervalVal)
      mypage.setData({ motto: "广播数据大小有误，大于20!" });
      return;
    }

    myProcess.configParameter2(locationId, sendIntVal, sendTimeVal, beaconMaskVal, beaconValueVal, thresValueVal, cancelValue, advIntervalVal, loraenableValue,function (msg){
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 
  },
 
  readParameter: function (e) {
    console.log("readParameter:" + locationId);
    mypage.setData({ motto: "开始读取..." });
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
          thresstr: "" + accThres,
          alarmstr: alarmNum+"次",
          motto: "读取完成!"
        })
      } else if (arr != null && arr.length == 25) {
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

        cancelValue = arr[23] & 0xff;
        cancelAlarmValue = arr[24] & 0xff;
        var alarmTypeStr="";
        if (cancelValue==0){
          alarmTypeStr="无法取消";
        } else if (cancelValue == 1) {
          alarmTypeStr = "连按5下取消";
        } else if (cancelValue == 2) {
          alarmTypeStr = "发送" + cancelAlarmValue+"次后取消";
        } 

        mypage.setData({
          sendIntervalstr: sendInterval + "秒",
          sendTimestr: sendTime + "秒",
          batterystr: battery + "V",
          hardwarestr: hardware,
          maskstr: "0x" + beaconMask.toString(16),
          beaconstr: "0x" + beaconValue.toString(16),
          thresstr: "" + accThres,
          alarmstr: alarmNum + "次",
          cancelalarmstr: alarmTypeStr,
          motto: "读取完成!"
        })
      } else if (arr != null && arr.length == 30) {
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

        cancelValue = arr[23] & 0xff;
        cancelAlarmValue = arr[24] & 0xff;

        var advInterval = ((arr[28] & 0xff) << 24) | ((arr[27] & 0xff) << 16) || ((arr[26] & 0xff) << 8) || (arr[25] & 0xff);
        loraenableValue = arr[29] & 0xff;
        var alarmTypeStr = "";
        if (cancelValue == 0) {
          alarmTypeStr = "无法取消";
        } else if (cancelValue == 1) {
          alarmTypeStr = "连按5下取消";
        } else if (cancelValue == 2) {
          alarmTypeStr = "发送" + cancelAlarmValue + "次后取消";
        }
        var lorastr="";
        if (loraenableValue == 0) {
          lorastr = "禁用";
        } else if (loraenableValue == 1) {
          lorastr = "启用";
        } 
        // advIntervalstr: "",
        //   loraenablestr: "",
        mypage.setData({
          sendIntervalstr: sendInterval + "秒",
          sendTimestr: sendTime + "秒",
          batterystr: battery + "V",
          hardwarestr: hardware,
          maskstr: "0x" + beaconMask.toString(16),
          beaconstr: "0x" + beaconValue.toString(16),
          thresstr: "" + accThres,
          alarmstr: alarmNum + "次",
          cancelalarmstr: alarmTypeStr,
          advIntervalstr: advInterval+"ms",
          loraenablestr: lorastr,
          motto: "读取完成!"
        })
      } else if (arr != null && arr.length == 31) {
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

        cancelValue = arr[23] & 0xff;
        cancelAlarmValue = arr[24] & 0xff;

        var advInterval = ((arr[28] & 0xff) << 24) | ((arr[27] & 0xff) << 16) || ((arr[26] & 0xff) << 8) || (arr[25] & 0xff);
        loraenableValue = arr[29] & 0xff;
        var mode = arr[30] & 0xff;

        var alarmTypeStr = "";
        if (cancelValue == 0) {
          alarmTypeStr = "无法取消";
        } else if (cancelValue == 1) {
          alarmTypeStr = "连按5下取消";
        } else if (cancelValue == 2) {
          alarmTypeStr = "发送" + cancelAlarmValue + "次后取消";
        }
        var lorastr = "";
        if (loraenableValue == 0) {
          lorastr = "禁用";
        } else if (loraenableValue == 1) {
          lorastr = "启用";
        }
        var modestr="";
        if (mode == 2) {
          modestr = "胸牌模式";
        } else if (mode == 4) {
          modestr = "锚点模式";
        }else{
          modestr = "未知";
        }

        // advIntervalstr: "",
        //   loraenablestr: "",
        mypage.setData({
          sendIntervalstr: sendInterval + "秒",
          sendTimestr: sendTime + "秒",
          batterystr: battery + "V",
          hardwarestr: hardware,
          maskstr: "0x" + beaconMask.toString(16),
          beaconstr: "0x" + beaconValue.toString(16),
          thresstr: "" + accThres,
          alarmstr: alarmNum + "次",
          cancelalarmstr: alarmTypeStr,
          advIntervalstr: advInterval + "ms",
          loraenablestr: lorastr,
          runmodestr: modestr,
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
