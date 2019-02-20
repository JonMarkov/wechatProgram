Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function(options) {

    wx.setStorage({
      key: "refId",
      data: options.user_id || '1'
    })
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              //从数据库获取用户信息, 如果客户已经授权用户已经授权过
              // wx.navigateTo({
              //   url: '/pages/home/home'
              // })
              wx.reLaunch({
                url: '/pages/home/home',
              });
            }
          });
        }
      }
    })
  },
  // 点击授权登录按钮
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      // 把用户信息设置进本地缓存
      wx.setStorage({
        key: "weChat",
        data: e.detail.userInfo
      })
      wx.getUserInfo({
        success: function(mes) {
          // 开始授权
          wx.login({
            success: res => {
              // 获取到微信返回的code
              var params = {
                encryptedData: mes.encryptedData,
                iv: mes.iv,
                code: res.code,
                nickName: e.detail.userInfo.nickName,
                headUrl: e.detail.userInfo.avatarUrl
              }
              params.code = res.code
              const newparams = Object.assign(params);
              wx.request({
                url: getApp().globalData.WX_user + getApp().globalData.wx_url_1,
                data: newparams,
                method: "GET",
                // dataType: JSON,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res => {
                  let temp = {
                    userId: res.data.data.userId,
                    ticket: res.data.token.ticket,
                    code: res.data.data.code

                  }
                  // 把用户得参数传入本地缓存
                  wx.setStorage({
                    key: "userInfo",
                    data: temp
                  })
                  // 授权成功之后跳转
                  // wx.navigateTo({
                  //   url: '/pages/home/home'
                  // })
                  wx.reLaunch({
                    url: '/pages/home/home',
                  });
                }
              })
            }
          });

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