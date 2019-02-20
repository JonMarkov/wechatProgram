// pages/endOrder/endOrder.js
var ListUrl_4 = getApp().globalData.WX_user + getApp().globalData.wx_url_4
var ListUrl_5 = getApp().globalData.WX_user + getApp().globalData.wx_url_5
var ListUrl_8 = getApp().globalData.WX_user + getApp().globalData.wx_url_8
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    motto: '喊好友观影开店',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.removeStorageSync('shopCartDataList')
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function(res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
    // 获取推荐人id
    var that = this;
    wx.getStorage({
      key: "refId",
      success: function (res) {
        that.setData({
          userId_id: res.data || ''
        })
        that.ObtainUserInfo()
      }
    })
    wx.getStorage({
      key: "orderList",
      success: function(res) {
        that.setData({
          orderList: res.data
        })
        that.PaymentStatus()
      }
    })
  },
  // 定义DY 请求支付状态函数
  PaymentStatus: function() {
    var _this = this
    console.log(this.data.orderList.ordId)
    wx.request({
      url: ListUrl_4,
      data: {
        orderId: _this.data.orderList.ordId,
      },
      // dataType: JSON,
      header: {
        'content-type': 'application/json', // 默认值
        'userid': _this.data.userInfo.userId,
        'terminal': 'MINIPRO',
        'ticket': _this.data.userInfo.ticket,
      },
      success: res => {
        console.log(res.data.data)
        let payOrderNo = res.data.data.order.orderNo
        let dataList = res.data.data.order;
        let orderDetailsList = res.data.data.orderDetails;
        let voucherCount = res.data.data.voucherCount;
        let OrderList = [];
        for (let i in orderDetailsList) {
          let temp = {
            count: orderDetailsList[i].count,
            orderDetailId: orderDetailsList[i].orderDetailId,
            productName: orderDetailsList[i].productName,

          }
          OrderList.push(temp)
        }
        _this.setData({
          amount: dataList.amount,
          OrderList: OrderList,
          voucherCount: voucherCount,
          payOrderNo: payOrderNo
        })
      }
    })
  },
  // 定义DY 获取用户信息函数----
  ObtainUserInfo: function () {
    let _this = this
    wx.request({
      url: ListUrl_5,
      method: "GET",
      data: {
        userId: _this.data.userId_id,
      },
      dataType: JSON,
      header: {
        'content-type': 'application/json', // 默认值
        'userid': _this.data.userInfo.userId,
        'terminal': 'MINIPRO',
        'ticket': _this.data.userInfo.ticket,
      },
      success: res => {

        _this.setData({
          HeNickname: JSON.parse(res.data).data.nickname,
          HeId: JSON.parse(res.data).data.id,
          HeheadPicUrl: JSON.parse(res.data).data.localHeadPic,
          HehedLevel: JSON.parse(res.data).data.level,
        })
      }
    })
  },
  ToBack:function(){
    wx:wx.navigateTo({
      url: '/pages/home/home',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 定义DY 分享接口
  shareMiniPro: function () {
    let _this = this
    wx.request({
      url: ListUrl_8,
      method: "GET",
      dataType: JSON,
      header: {
        'content-type': 'application/json', // 默认值
        'userid': _this.data.userInfo.userId,
        'terminal': 'MINIPRO',
        'ticket': _this.data.userInfo.ticket,
      },
      success: res => {
        _this.setData({
          shareList: JSON.parse(res.data).data
        })
      }
    })
  },
  SeeShop:function(){
    console.log(this.data)
      wx.navigateTo({
        url: '/pages/login/login?user_id=' + this.data.userInfo.userId,
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //执行ZX 小程序分享
    this.shareMiniPro()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    let title = this.data.shareList.shareList
    let imageUrl = this.data.shareList.picUrl
    let path = this.data.shareList.path
    return {
      title: title,
      imageUrl: imageUrl,
      path: path
    }

  }
})