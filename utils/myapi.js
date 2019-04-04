let myApi = {
  server: {
    url: "https://api.sagewont.cn/islocking/wx"
  },
  test1(callback) {
    var _this = this;
    wx.request({
      url: _this.server.url,
      data: { c: '2' },
      success: function (res) {
        callback && callback(res.data);
      }
    })
  },
  login(phone,pwd,callback) {
    var _this = this;
    wx.request({
      url: _this.server.url,
      data: { c: 'login', u:phone,p:pwd},
      success: function (res) {
        callback && callback(res.data);
      }
    })
  },
  regester(user, pwd, callback) {
    var _this = this;
    wx.request({
      url: _this.server.url,
      data: { c: 'regester', user: user, pwd: pwd },
      success: function (res) {
        callback && callback(res.data);
      }
    })
  },
  webmain(requestName,cmd, paramObj, callback) {
    var _this = this;
    if(paramObj==null){
      paramObj=new Object();
    }
    paramObj["webmain_name"] = requestName;
    paramObj["cmd"] = cmd;
    paramObj["c"] = "webmainRequest";
    wx.request({
      url: _this.server.url,
      data: paramObj,
      success: function (res) {
        console.log(res)
        callback && callback(res.data);
      }
    })
  },
  getCommunity(user, pwd, callback) {
    var _this = this;
    wx.request({
      url: _this.server.url,
      data: { c: 'getallcommunity', u: user, p: pwd },
      success: function (res) {
        callback && callback(res.data);
      }
    })
  },
  getAuthApp(user, pwd, callback) {
    var _this = this;
    wx.request({
      url: _this.server.url,
      data: { c: 'getallauthapp', u: user, p: pwd },
      success: function (res) {
        callback && callback(res.data);
      }
    })
  },
  
  /*其他辅助模块*/
}
module.exports.MyServerApi = myApi;
