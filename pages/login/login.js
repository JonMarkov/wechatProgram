// 定义请求接口
var miniProEncrypt = getApp().globalData.WX_user + getApp().globalData.wx_url_1
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function(options) {
    if (options.shopDian) {
      this.setData({
        shopDian: options.shopDian
      })
    }
    // 获取当前的时间戳
    var timestamp = Date.parse(new Date()) / 1000;
    // 从APP中带来的用户Id
    wx.setStorage({
      key: "refId",
      data: options.user_id || '1'
    })
    // 获取推荐人id
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function(res) {
        // 开始执行查看是否已经授权了
        that.AlreadyGrant(res.data.timestamp, res.data.days)
      }
    })
  },
  // 已经授权的情况
  AlreadyGrant: function(callback, days) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        // 当前时间戳
        let timestamp = Date.parse(new Date()) / 1000;
        // 查看是否授权过
        let grant = res.authSetting['scope.userInfo']
        // 授权时间是否超过一天
        let timeTF = timestamp < (callback + 86400 * days)
        // 如果授权过且未超过一天则直接跳转
        if (grant && timeTF) {
          wx.reLaunch({
            url: '/pages/home/home',
          });
        }
      }
    })
  },
  // 点击授权登录按钮
  bindGetUserInfo: function(e) {
    // 把授权时的当前时间存入缓存
    var timestamp = Date.parse(new Date()) / 1000;
    if (e.detail.userInfo) {
      // 把用户信息设置进本地缓存
      wx.setStorage({
        key: "weChat",
        data: e.detail.userInfo
      })
      // 开始授权
      wx.login({

        success: res => {
          let _this = this
          // 获取到微信返回的code
          wx.getUserInfo({
            success: function(res1) {
              var encryptedData = res1.encryptedData
              var iv = res1.iv
              var params = {
                code: res.code,
                nickName: e.detail.userInfo.nickName,
                headUrl: e.detail.userInfo.avatarUrl,
                encryptedData: encryptedData,
                iv: iv
              }
              params.code = res.code
              const newparams = Object.assign(params);
              wx.request({
                url: miniProEncrypt,
                data: newparams,
                method: "GET",
                // dataType: JSON,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res => {
                  let temp = {
                    days: res.data.token.days,
                    timestamp: timestamp,
                    userId: res.data.data.userId,
                    ticket: res.data.token.ticket,
                    code: res.data.data.code
                  }
                  // 把用户得参数传入本地缓存
                  wx.setStorage({
                    key: "userInfo",
                    data: temp
                  })
                  // 用户等级
                  wx.setStorage({
                    key: "level",
                    data: res.data.data.level
                  })
                  // 授权成功之后跳转
                  let Lo = 'login'
                  if (_this.data.shopDian) {
                    wx.setStorage({
                      key: "shopDian",
                      data: _this.data.shopDian
                    })
           
                  }
                  wx.reLaunch({
                    url: '/pages/home/home?Lo=' + Lo,
                  });
                }
              })
            }
          })
        }
      });

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
})