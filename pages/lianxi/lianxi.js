// pages/video/video.js
//生成随机颜色的弹幕
function getRandomColor() {
  let rgb = [];
  for (let i = 0; i < 3; i++) {
    let color = (Math.floor(Math.random() * 256)).toString(16);
    color = color.length == 1 ? ('0' + color) : color;
    rgb.push(color)
  }
  return "#" + rgb.join("");
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    danmulist: [{
      text: "这是第一条弹幕",
      time: 1,
      color: "#f00"
    }, {
      text: "这是第二条弹幕",
      time: 6,
      color: "#0f0"
    }, {
      text: "这是第三条弹幕",
      time: 3,
      color: "#00f"
    }],
    danmu: "default"
  },
  onReady: function () {
    this.videoContext = wx.createVideoContext("myvideo");
    console.log(this.videoContext);
  },
  playVideo: function () {
    this.videoContext.play();
  },
  stopVideo: function () {
    this.videoContext.pause();
  },

  // 发送弹幕
  sendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.data.danmu,
      color: getRandomColor()
    })
  },
  seekVideo: function () {
    this.videoContext.seek(100);
  },

  getInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      danmu: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
