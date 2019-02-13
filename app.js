App({
  /**     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）     */
  onLaunch: function() {
    var that = this;
  },
  /**     * 设置全局变量     */
  globalData: {
    openid: 0,
    // wx_url_1: 'https://api-plus-test.kkstudy.cn/login/weixin',
    // 登陆授权接口GET /user/login/miniProEncrypt
    wx_url_1: 'https://plus-api.kankan.com/user/login/miniProEncrypt',
    // 电影列表接口
    wx_url_2: 'https://plus-api.kankan.com/user/shop/getMySpreadListByUserId',
    // 支付接口
    wx_url_3: 'https://plus-api.kankan.com/order/unifiedOrder',
    // 支付状态接口
    wx_url_4: 'https://plus-api.kankan.com/order/queryOrderDetails',
    // 获取用户信息接口
    wx_url_5: 'https://plus-api.kankan.com/base/user/getUserNameById',
    // 获取小店累计收入函数
    // wx_url_6: 'https://api-plus-test.kkstudy.cn/base/user/getUserAccumulatedIncome',
    wx_url_6:'https://rebate-api.kankan.com/rebate/user/getUserAccumulatedIncomeNoLogin',
    // 获取视频地址
    wx_url_7: 'https://plus-api.kankan.com/base/movie/getMovieTicketForMini',
    //小程序分享
    wx_url_8: 'https://plus-api.kankan.com/weixin/share/miniPro',
    //小程序分享
    wx_url_9: 'https://plus-api.kankan.com/user/shop/getOfficialRecommendation',

  }
})