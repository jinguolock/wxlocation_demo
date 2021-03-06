
var myApi = require('../../utils/myapi.js').MyServerApi;
var myProcess = require('../../utils/myprocess.js').MyProcess;
const app = getApp()
var mypage
var locationId
// var ipval ="192.168.1.98"
// var maskval ="255.255.255.0"
// var gatewayval = "192.168.1.1"
// var dnsval = "192.168.1.1"
// var sendtoval = "0.0.0.0"
// var staticipval = 1
var ipval 
var maskval 
var gatewayval 
var dnsval 
var sendtoval 
var staticipval = -1

var readipval
var readmaskval
var readgatewayval
var readdnsval
var readsendtoval
var readstaticipval = -1

var tcpval
var mystationId

var staticStrarr = ["未知","动态", "静态"]
var tcpStrarr = ["unkown","UDP", "TCP"]

Page({
  data: {
    deviceId: "",
    ipstr:"",
    maskstr: "",
    gatewaystr: "",
    sendipstr: "",
    staticipstr: "",
    dnsstr:"",
    tcpstr: "",
    urlstr: "",
    hardwarestr:"",
    macstr:"",
    serverportstr: "",
    localportstr: "",
    statusstr:"",
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
  onShow: function () {
    //console.log("station onShow")
    let that = this;
    mypage = this;
    //blueApi.searchBleDevices();
   // intervalid = setInterval(mypage.mytimeout, 1000);
    mystationId = wx.getStorageSync('configStationId')
    console.log("my stationid:" + mystationId)
    mypage.setData({
      deviceId: mystationId
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
    mypage.setData({ staticipstr: "静态"})
    staticipval = 1
  },
  senddhcp: function (e) {
    mypage.setData({ staticipstr: "动态" })
    staticipval = 2
  },
  ipInputEvent:function(e){
    ipval=e.detail.value
  },
  maskInputEvent: function (e) {
    maskval = e.detail.value
  },
  gatewayInputEvent: function (e) {
    gatewayval = e.detail.value
  },
  dnsInputEvent: function (e) {
    dnsval = e.detail.value
  },
  sendtoInputEvent: function (e) {
    sendtoval = e.detail.value
  },
  checkipRight:function (ip){
    if(ip==null||ip==""||ip.length==0){
      return false;
    }
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;   
    if (re.test(ip)) {
      if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
        return true;
    }
    return false;
  },
  setError:function (msg){
    mypage.setData({
      motto: msg
    })
  },
  updateParameter: function (e) {
    // var readipval
    // var readmaskval
    // var readgatewayval
    // var readdnsval
    // var readsendtoval
    // var readstaticipval = -1
    if (ipval == null || myProcess.trim(ipval).length == 0) {
      console.log("ipval is null,use:" + readipval);
      ipval = readipval;
    }
    if (maskval == null || myProcess.trim(maskval).length == 0) {
      console.log("maskval is null,use:" + readmaskval);
      maskval = readmaskval;
    }
    if (gatewayval == null || myProcess.trim(gatewayval).length == 0) {
      console.log("gatewayval is null,use:" + readgatewayval);
      gatewayval = readgatewayval;
    }
    if (dnsval == null || myProcess.trim(dnsval).length == 0) {
      console.log("dnsval is null,use:" + readdnsval);
      dnsval = readdnsval;
    }
    if (sendtoval == null || myProcess.trim(sendtoval).length == 0) {
      console.log("sendtoval is null,use:" + readsendtoval);
      sendtoval = readsendtoval;
    }
    if (staticipval == null || staticipval < 0) {
      console.log("staticipval is null,use:" + readstaticipval);
      staticipval = readstaticipval
    }

    if (staticipval != 1 && staticipval != 2) {
      this.setError("没有选择是否DHCP！")
      return
    }
    if (staticipval==1){
      if (!this.checkipRight(ipval)) {
        this.setError("ip地址配置有误！")
        return
      }
      if (!this.checkipRight(maskval)) {
        this.setError("地址掩码配置有误！")
        return
      }
      if (!this.checkipRight(gatewayval)) {
        this.setError("网关地址配置有误！")
        return
      }
      if (!this.checkipRight(dnsval)) {
        this.setError("dns配置有误！")
        return
      }
      if (!this.checkipRight(sendtoval)) {
        this.setError("指向地址配置有误！")
        return
      }
    }
    if (staticipval == 2) {
      if (!this.checkipRight(ipval)) {
        ipval = "192.168.1.98"
      }
      if (!this.checkipRight(maskval)) {
        maskval = "255.255.255.0"
      }
      if (!this.checkipRight(gatewayval)) {
        gatewayval = "192.168.1.1"
      }
      if (!this.checkipRight(dnsval)) {
        dnsval = "192.168.1.1"
      }
      if (!this.checkipRight(sendtoval)) {
        dnsval = "192.168.1.1"
      }
    }

    
    mypage.setData({ motto: "开始配置..." });
    this.setError("开始配置");

    myProcess.configParameter_stationNet(mystationId, ipval, maskval, gatewayval, dnsval, sendtoval, staticipval, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "配置完成!" });
    }) 


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
 
  readParameter: function (e) {
    console.log(e.detail.value);
    this.getParameter()
  },
  getParameter: function(){
    mypage.setData({ motto: "开始读取..." });

    console.log("readParameter");
    myProcess.syncParameter_station(mystationId, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      console.log(arr);
      if (arr == null || arr.length < 56) {
        console.log("error arr length:" + arr.length);
        return;
      }

      var hardware = "V" + (arr[0] & 0xff).toString() + "." + (arr[1] & 0xff).toString() + "." + (arr[2] & 0xff).toString() + "." + (arr[3] & 0xff).toString();

      var myIp = (arr[4] & 0xff).toString() + "." + (arr[5] & 0xff).toString() + "." + (arr[6] & 0xff).toString() + "." + (arr[7] & 0xff).toString();
      var myMask = (arr[8] & 0xff).toString() + "." + (arr[9] & 0xff).toString() + "." + (arr[10] & 0xff).toString() + "." + (arr[11] & 0xff).toString();
      var myGW = (arr[12] & 0xff).toString() + "." + (arr[13] & 0xff).toString() + "." + (arr[14] & 0xff).toString() + "." + (arr[15] & 0xff).toString();
      var myDns = (arr[16] & 0xff).toString() + "." + (arr[17] & 0xff).toString() + "." + (arr[18] & 0xff).toString() + "." + (arr[19] & 0xff).toString();

      var myMac = (arr[20] & 0xff).toString(16) + "." + (arr[21] & 0xff).toString(16) + "." + (arr[22] & 0xff).toString(16) + "." + (arr[23] & 0xff).toString(16) + "." + (arr[24] & 0xff).toString(16) + "." + (arr[25] & 0xff).toString(16);

      var runingIp = (arr[26] & 0xff).toString() + "." + (arr[27] & 0xff).toString() + "." + (arr[28] & 0xff).toString() + "." + (arr[29] & 0xff).toString();
      var runingMask = (arr[30] & 0xff).toString() + "." + (arr[31] & 0xff).toString() + "." + (arr[32] & 0xff).toString() + "." + (arr[33] & 0xff).toString();
      var runingGW = (arr[34] & 0xff).toString() + "." + (arr[35] & 0xff).toString() + "." + (arr[36] & 0xff).toString() + "." + (arr[37] & 0xff).toString();
      var runingDns = (arr[38] & 0xff).toString() + "." + (arr[39] & 0xff).toString() + "." + (arr[40] & 0xff).toString() + "." + (arr[41] & 0xff).toString();

      var sendtoIp = (arr[42] & 0xff).toString() + "." + (arr[43] & 0xff).toString() + "." + (arr[44] & 0xff).toString() + "." + (arr[45] & 0xff).toString();
      var serverPort = ((arr[47] & 0xff) << 8) | (arr[46] & 0xff);
      var serverTcpPort = ((arr[49] & 0xff) << 8) | (arr[48] & 0xff);

      var isStatic = arr[50] & 0xff;
      var isUdp = arr[51] & 0xff;

      var myLocalPort = ((arr[53] & 0xff) << 8) | (arr[52] & 0xff);
      var mystatus = arr[54] & 0xff;
      var urlLen = arr[55] & 0xff;
      var url = "";
      if (urlLen > 0) {
        for (var i = 0; i < urlLen; i++) {
          url += new String(arr[56 + i]);
        }
      }
      var statusstr = "";
      if (mystatus == 1) {
        statusstr = "网口无响应,无法配置！";
      } else if (mystatus == 2) {
        statusstr = "网口芯片正常,获取地址失败！";
      } else if (mystatus == 3) {
        statusstr = "正常运行中！";
      } else if (mystatus == 0) {
        statusstr = "1301初始化失败！";
      } else if (mystatus == 4) {
        statusstr = "DHCP失败,静态地址运行中！";
      } else if (mystatus == 5) {
        statusstr = "DNS访问失败，无法推送数据！";
      } else if (mystatus == 6) {
        statusstr = "URL访问失败，无法推送数据！";
      }

      console.log("hardware:" + hardware);
      console.log("myIp:" + myIp);
      console.log("myMask:" + myMask);
      console.log("myGW:" + myGW);
      console.log("myDns:" + myDns);
      console.log("myMac:" + myMac);
      console.log("runingIp:" + runingIp);
      console.log("runingMask:" + runingMask);
      console.log("runingGW:" + runingGW);
      console.log("runingDns:" + runingDns);
      console.log("sendtoIp:" + sendtoIp);
      console.log("serverPort:" + serverPort);
      console.log("serverTcpPort:" + serverTcpPort);
      console.log("isStatic:" + isStatic);
      console.log("isUdp:" + isUdp);
      console.log("myLocalPort:" + myLocalPort);
      console.log("mystatus:" + mystatus);
      console.log("urlLen:" + urlLen);
      console.log("url:" + url);


      readipval = myIp
      readmaskval = myMask
      readgatewayval = myGW
      readdnsval = myDns
      readsendtoval = sendtoIp
      readstaticipval = isStatic

      mypage.setData({
        ipstr: runingIp,
        maskstr: runingMask,
        gatewaystr: runingGW,
        sendipstr: sendtoIp,
        dnsstr: runingDns,
        staticipstr: isStatic == 1 ? "静态" : "动态",
        tcpstr: isUdp == 1 ? "UDP" : "TCP",
        macstr: myMac,
        serverportstr: serverPort + "",
        localportstr: myLocalPort + "",
        hardwarestr: hardware,
        statusstr: statusstr,
        motto: "读取完成!"
      })
    }
    )
  },
  toDfu: function (e) {
    mypage.setData({ motto: "等待进入DFU..." });

    myProcess.configToDfu_station(mystationId, function (msg) {
      mypage.setMotto(msg)
    }, function (arr) {
      mypage.setData({ motto: "DFU等待升级!" });
    })


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

})
