App({
  /**     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）     */
  onLaunch: function() {
    var that = this;
  },
  /**     * 设置全局变量     */
  globalData: {
    openid: 0,
    // 公共前缀
    // WX_user:'https://plus-api.kankan.com',
    WX_user: 'https://plus-api.kkstudy.cn',
    Wx_rebate:'https://rebate-api.kkstudy.cn',
    // 登陆授权接口
    wx_url_1: '/user/login/miniProEncrypt',
    // 电影列表接口
    wx_url_2: '/user/shop/getMySpreadListByUserId',
    // 支付接口
    wx_url_3: '/order/unifiedOrder',
    // 支付状态接口
    wx_url_4: '/order/queryOrderDetails',
    // 获取用户信息接口
    wx_url_5: '/base/user/getUserNameById',
    // 获取小店累计收入函数
    wx_url_6:'/rebate/user/getUserAccumulatedIncomeNoLogin',
    // 获取视频地址
    wx_url_7: '/base/movie/getMovieTicketForMini',
    //小程序分享
    wx_url_8: '/weixin/share/miniPro',
    //小程序分享
    wx_url_9: '/user/shop/getOfficialRecommendation',
    // 获取指定人的推广
    wx_url_10:'/user/shop/getMySpreadListByUserId',
    // 获取指定人的待推广
    wx_url_11:'/user/shop/getMyNoSpreadListNoLogin'
  }
})