// pages/movieDet/movieDet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCartDataList: [{
      movieName: '喜剧之王',
      moviePrice: '3.99',
      movieNum: '1',
      movieStatus: false,
      movieId: 65737,
      salesCount: ''
    },],
    shopCartIndexMoney: '123',
    shopCartIndexI: '1',
    shopNuStatus: false,
    videoState: "http://61.133.53.18/data/cdn_transfer/99/91/9996ec06155550c94e7b02214b4c1cbefa330a91.mp4",
  },
  //定义DY 点击出现购物车弹窗
  BindToPopup: function() {
    if (this.data.shopPopup == true) {
      this.setData({
        shopPopup: false,
      })
    } else {
      this.setData({
        shopPopup: true,
      })
    }
  },
  // 定义DY 获取缓存内的信息
  GetCache: function() {
    console.log('2')
    var that = this;
    wx.getStorage({
      key: "shopCartDataList",
      success: function(res) {
        console.log(res.data)
        that.setData({
          shopCartDataList: res.data || ''
        })
        // 计算商品数量函数执行
        that.workOutNum(res.data)
      }
    })
  },
  // 计算商品数量
  workOutNum: function(call) {
    console.log(call)
    let call_b = call
    let M_num = 0
    for (let i in call_b){
      if (call_b[i].movieStatus !=false){
        let callNum = call_b[i].movieNum
        M_num = M_num + callNum
      }
    }
   this.setData({
     shopCartIndexI:M_num
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取缓存内的数据
    this.GetCache()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 计算商品数量

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
  onShareAppMessage: function() {

  }
})