// pages/home/home.js
// 声明SM 调用接口声明
var ListUrl = getApp().globalData.wx_url_2
var ListUrl_3 = getApp().globalData.wx_url_3
var ListUrl_5 = getApp().globalData.wx_url_5
var ListUrl_6 = getApp().globalData.wx_url_6
var ListUrl_7 = getApp().globalData.wx_url_7
var ListUrl_8 = getApp().globalData.wx_url_8
var ListUrl_9 = getApp().globalData.wx_url_9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    videoState: '',
    mac: 0,
    macMa: '躺着挣钱 的看看小店赚了￥886.00',
    indexList: [
      '躺着挣钱 的看看小店赚了￥886.001',
      '躺着挣钱 的看看小店赚了￥886.002',
      '躺着挣钱 的看看小店赚了￥886.003',
      '躺着挣钱 的看看小店赚了￥886.004',
    ],
    userInfo: [],
    // 用户广告消息是否显示
    userAdvNews: false,
    // 购物车是否有数据
    shopCart: false,
    //购物车数据
    shopCartDataList: [{
      movieName: '喜剧之王',
      moviePrice: '3.99',
      movieNum: '1',
      movieStatus: false,
      movieId: 65737,
      salesCount: ''
    }, ],
    // 购物车是否有商品
    shopStatus: true,
    //购物车弹窗是否显示
    shopPopup: false,
    shopCartIndexI: '',
    shopCartIndexMoney: '',
    videoState: "http://61.133.53.18/data/cdn_transfer/99/91/9996ec06155550c94e7b02214b4c1cbefa330a91.mp4",
    shopNuStatus: true,
    HeheadPicUrl: '../../images/head_url.png',
    dp: false,
    HeMoney: '**.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 获取推荐人id
    var that = this;
    wx.getStorage({
      key: "refId",
      success: function(res) {
        that.setData({
          userId_id: res.data || ''
        })
      }
    })
    // 执行ZX 求购物车商品条数
    this.ShopCartIndexI()
    // 执行ZX 执行请求视频列表
    this.GetUserInfo(this.GetUserInfoCallback)
    //判断购物车是否有商品
    this.ShopNull()
  },
  
  // 弹窗
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },

  // 弹出框蒙层截断touchmove事件
  preventTouchMove: function() {},
  
  //  隐藏模态对话框
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  hideModalshopPopup: function() {
    this.setData({
      shopPopup: false
    })
  },
  // 对话框取消按钮点击事件
  onCancel: function() {
    this.hideModal();
  },

  // 对话框确认按钮点击事件
  onConfirm: function() {
    this.hideModal();
  },

  //定义DY 求购物车商品条数和总价
  ShopCartIndexI: function() {
    let cartList = this.data.shopCartDataList
    var shopNum = [0]
    var shopMoney = [0]
    // 循环购物车商品
    for (let i in cartList) {
      if (cartList[i].movieStatus == true) {
        // 单个商品数量
        let cartDNmu = cartList[i].movieNum
        // 单个商品价钱
        let cartMoney = cartList[i].moviePrice
        // 单个商品价钱乘以数量 
        let TotalMoney = cartDNmu * cartMoney
        // 总数量数组
        shopNum.push(cartDNmu)
        // 总价钱数组
        shopMoney.push(TotalMoney)
      }
    }
    // 数组求和 购买总数
    const numSum = shopNum.reduce((a = 0, i) => a + Number(i))
    // 数组求和 总价
    const MoneySum = (shopMoney.reduce((a = 0, i) => a + Number(i))).toFixed(2)
    this.setData({
      shopCartIndexI: numSum,
      shopCartIndexMoney: MoneySum
    })
  },
  //定义DY 购物车全部清空
  emptyFn: function() {
    let cartList = this.data.shopCartDataList;
    for (let i in cartList) {
      cartList[i].movieStatus = false
    }
    this.setData({
      shopCartDataList: this.data.shopCartDataList
    })
    // 判断商品条数和总价钱
    this.ShopCartIndexI()
    // 清空购物车中数据
    this.ShopNull()
    // 判断购物车中是否有商品
    this.shopTandF()
  },
  // 判断购物车中是否有商品
  shopTandF: function() {
    console.log(this.data.shopCartDataList)
    let shopList = this.data.shopCartDataList
    for (let i in shopList) {
      if (shopList[i].movieStatus == false) {
        for (let j in this.data.movieList) {
          this.data.movieList[j].movieNum = 0;
          this.data.movieList[j].movieStatus = false;
          this.data.shopCartDataList[i].movieNum = 0
        }

        this.setData({
          movieList: this.data.movieList,
          // 购物车是否有商品
          shopStatus: false,
          //购物车弹窗是否显示
          shopPopup: false,

        })
      } else {
        this.setData({
          // 购物车是否有商品
          shopStatus: true,
          //购物车弹窗是否显示
          shopPopup: true,
        })
      }
    }
  },
  // 定义DY 消息列表动画函数定义
  PushMessage: function() {
    // 重定向this值
    var _this = this;
    // 初始化声明一个i
    var i = 0
    // 初始化滑出页面
    var animationCloudData = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out',
      //transformOrigin: '4px 91px'
    });

    //动画的脚本定义必须每次都重新生成，不能放在循环外
    animationCloudData.translateX(200).step({
      duration: 2500
    }).opacity(0).step({
      duration: 1000
    });

    // 定义data数据。更新数据
    _this.setData({
      // 导出动画示例
      animationCloudData: animationCloudData.export(),
    })
    // 循环执行定时器-闪烁效果
    setInterval(function() {
      // i+1
      ++i;
      // 每次显示第几条
      var disInfo = Math.floor(i / 2);
      // data中总条目数目
      var disLen = (_this.data.indexList.length) - 1
      // 如果当前显示的条数大于等于总条目数
      if (disInfo >= disLen) {
        i = 0
      }
      //动画的脚本定义必须每次都重新生成，不能放在循环外
      animationCloudData.translateX(200).step({
        duration: 2500
      }).opacity(0).step({
        duration: 2500
      });
      //动画的脚本定义必须每次都重新生成，不能放在循环外
      animationCloudData.translateX(200).step({
        duration: 2500
      }).opacity(1).step({
        duration: 2500
      });
      // 更新数据
      _this.setData({
        // 导出动画示例
        animationCloudData: animationCloudData.export(),
        macMa: _this.data.indexList[disInfo]
      })
    }.bind(_this), 2500); //3000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错

  },
  // 定义DY 获取本地缓存 userInfo后执行设置数据到data的函数（请求视频列表）
  GetUserInfo: function(callback) {
    var that = this;
    wx.getStorage({
      key: "userInfo",
      success: function(res) {
        callback(res)
      }
    })
  },
  // 定义DY 获取缓存数据GetUserInfo的函数执行后设置数据到data的回调函数
  GetUserInfoCallback: function(res) {
    this.setData({
      userInfo: res.data
    })
    //执行ZX 初始化遍历事件函数（在此处执行的意义是保证或获取到缓存数据）
    this.GetUserInfoHttpCallback()
  },
  // 定义DY 获取缓存数据GetUserInfo的函数执行后设置数据到data回调函数之后请求视频列表函数
  GetUserInfoHttpCallback: function() {
    console.log(this.data)
    var _this = this
    if (_this.data.userId_id == 1){
      wx.request({
        url: ListUrl_9,
        data: {
          limit: 10,
          offset: 0,
          total: '',
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
          let movieList = res.data.data;
          _this.setData({
            movieList: movieList
          })
        }
      })
    }else{
      wx.request({
        url: ListUrl,
        data: {
          limit: 10,
          offset: 0,
          total: '',
          userId: _this.data.userId_id
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
          let movieList = res.data.data;
          _this.setData({
            movieList: movieList
          })
        }
      })
    }

  },
  // 定义DY 购物车数量减函数定义
  BindToSubNum: function(e) {
    // 点击的索引
    let index = e.currentTarget.dataset.index
    // 全部的购物车数据
    let shopCartDataList = this.data.shopCartDataList
    // 如果小于等于0则删除这条记录
    if (this.data.shopCartDataList[index].movieNum <= 1) {
      this.data.shopCartDataList[index].movieNum--
        this.data.shopCartDataList[index].movieStatus = false
    } else {
      this.data.shopCartDataList[index].movieNum--
    }
    this.setData({
      shopCartDataList: this.data.shopCartDataList
    })
    // 执行ZX 求购物车商品条数
    this.ShopCartIndexI()
    // 执行ZX 计算每天商品的条数视频列表
    this.NumberCalculation()
    // 如果购物车数组中movieStatus全部为false则更改状态
    for (let i in this.data.shopCartDataList) {
      if (shopCartDataList[i].movieStatus == false) {
        this.setData({
          // 购物车是否有商品
          shopStatus: false,
          //购物车弹窗是否显示
          shopPopup: false,
        })
      } else {
        this.setData({
          // 购物车是否有商品
          shopStatus: true,
          //购物车弹窗是否显示
          shopPopup: true,
        })
        return
      }
    }
    // 执行ZX 判断购物车是否有商品
    this.ShopNull()
  },
  // 定义DY 购物车数量加函数定义
  BindToAddNum: function(e) {
    // 点击的索引
    let index = e.currentTarget.dataset.index
    // 全部的购物车数据
    let shopCartDataList = this.data.shopCartDataList
    // 全部视频列表数据
    let movieList = this.data.movieList
    console.log(movieList)
    for (let i in movieList) {
      if (shopCartDataList[index].movieId == movieList[i].movieId) {
        this.data.movieList[i].movieNum++
      }
    }
    // 点击加一
    this.data.shopCartDataList[index].movieNum++
      this.data.shopCartDataList[index].movieStatus = true
    this.setData({
      shopCartDataList: this.data.shopCartDataList,
      movieList: this.data.movieList
    })
    // 执行ZX 求购物车商品条数
    this.ShopCartIndexI()
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
  //定义DY 点击视频列表中的减号
  BindToAddCart: function(e) {
    // 购物车数据列表
    let shopCart = this.data.shopCartDataList
    // 点击当前的视频id
    let movieListMovieId = e.currentTarget.dataset.movieid
    //
    for (let i in shopCart) {
      if (shopCart[i].movieId == movieListMovieId) {
        if (this.data.shopCartDataList[i].movieNum <= 1) {
          this.data.shopCartDataList[i].movieNum--
            this.data.shopCartDataList[i].movieStatus = false
        } else {
          this.data.shopCartDataList[i].movieNum--
        }
        this.setData({
          shopCartDataList: this.data.shopCartDataList
        })
      }
    }
    // 执行ZX 求购物车商品条数
    this.ShopCartIndexI()
    // 执行ZX 计算每天商品的条数视频列表
    this.NumberCalculation()
    // 如果购物车数组中movieStatus全部为false则更改状态
    for (let i in this.data.shopCartDataList) {
      console.log(this.data.shopCartDataList[i])
      if (this.data.shopCartDataList[i].movieStatus == false) {
        this.setData({
          // 购物车是否有商品
          shopStatus: false,
          //购物车弹窗是否显示
          shopPopup: false,
        })
      } else {
        this.setData({
          // 购物车是否有商品
          shopStatus: true,
          //购物车弹窗是否显示
        })
        return
      }
    }
    // 执行ZX 判断购物车是否为空
    this.ShopNull()

  },
  // 定义DY 点击视频列表中的加号
  BindToSubCart: function(e) {
    this.setData({
      shopStatus: true
    })
    // 购物车数据列表
    let shopCart = this.data.shopCartDataList
    // 点击当前的视频id
    let movieListMovieId = e.currentTarget.dataset.movieid
    // 点击当前的视频索引
    let index = e.currentTarget.dataset.index
    // 获取所有视频列表
    let movieList = this.data.movieList
    for (let i in shopCart) {
      // 获取当前循环购物车中的视频id
      let shopCartMovieId = this.data.shopCartDataList[i].movieId
      // 如果点击当前的视频id等于当前循环购物车中的视频id
      if (shopCartMovieId == movieListMovieId) {
        // 点击加一
        this.data.shopCartDataList[i].movieNum++
          this.data.shopCartDataList[i].movieStatus = true
        this.setData({
          shopCartDataList: this.data.shopCartDataList,
        })
        // 执行ZX 计算每天商品的条数视频列表
        this.NumberCalculation()
        // 执行ZX 求购物车商品条数
        this.ShopCartIndexI()
        //执行ZX 判断购物车是否为空
        this.ShopNull()
        return
      }
    }
    for (let i in shopCart) {
      // 获取当前循环购物车中的视频id
      let shopCartMovieId = this.data.shopCartDataList[i].movieId
      // 如果点击当前的视频id等于当前循环购物车中的视频id
      if (shopCartMovieId != movieListMovieId) {
        let temp = {
          movieName: movieList[index].movieName,
          moviePrice: movieList[index].agencyPrice,
          movieNum: 1,
          movieStatus: true,
          movieId: movieList[index].movieId,
          productId: movieList[index].productId
        }
        shopCart.push(temp)
        console.log(shopCart)
        this.setData({
          shopCartDataList: shopCart
        })
      }
      // 执行ZX 求购物车商品条数
      this.ShopCartIndexI()
      // 执行ZX 计算每天商品的条数视频列表
      this.NumberCalculation()
      //执行ZX 判断购物车是否为空
      this.ShopNull()
      return
    }


  },
  //定义DY 计算每天商品的条数视频列表*******
  NumberCalculation: function() {
    console.log(this.data.shopCartDataList)
    console.log(this.data.movieList)
    // 视频列表
    for (let i in this.data.movieList) {
      // 购物车列表
      for (let j in this.data.shopCartDataList) {
        if (this.data.movieList[i].movieId == this.data.shopCartDataList[j].movieId) {
          this.data.movieList[i].movieNum = this.data.shopCartDataList[j].movieNum
          this.data.movieList[i].movieStatus = this.data.shopCartDataList[j].movieStatus
        }
      }
    }
    this.setData({
      movieList: this.data.movieList
    })
    console.log(this.data.movieList)
  },
  // 定义DY 点击购买函数 点击之后执行
  BindToBuy: function(e) {
    console.log(this.data.shopCartDataList)
    let _this = this;
    let shopCartDataList = this.data.shopCartDataList;
    let Tobuy = [];
    for (let i in shopCartDataList) {
      if (shopCartDataList[i].movieStatus == true) {
        let temp = {
          id: shopCartDataList[i].productId,
          num: shopCartDataList[i].movieNum
        }
        Tobuy.push(temp)
      }

    }
    let newP = {
      "payMethod": "W1",
      "products": Tobuy,
      "sellUserId": _this.data.userId_id,
      "userId": _this.data.userInfo.userId
    }
    console.log(newP)
    let uov = {
      uov: JSON.stringify(newP)
    }
    wx.request({
      url: ListUrl_3,
      data: uov,
      method: "POST",
      dataType: JSON,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'userid': _this.data.userInfo.userId,
        'terminal': 'MINIPRO',
        'ticket': _this.data.userInfo.ticket,
      },
      success: res => {
        console.log(JSON.parse(res.data).data.wxReturn)
        var pay = JSON.parse(res.data).data.wxReturn
        var payOrderNo = JSON.parse(res.data).data.order
        let orderList = {
          orderNo: payOrderNo.orderNo,
          ordId: payOrderNo.id
        }
        wx.setStorage({
          key: "orderList",
          data: orderList
        })

        var timeStamp_pay = pay.timeStamp;
        var nonceStr_pay = pay.nonceStr;
        var package_pay = pay.package;
        var signType_pay = pay.signType;
        var paySign_pay = pay.sign
        wx.requestPayment({
          'timeStamp': timeStamp_pay.toString(),
          'nonceStr': nonceStr_pay,
          'package': package_pay,
          'signType': signType_pay,
          'paySign': paySign_pay,
          'success': function(res) {
            console.log(res.errMsg == 'requestPayment:ok')
            if (res.errMsg == 'requestPayment:ok') {
              wx: wx.navigateTo({
                url: '/pages/endOrder/endOrder',
              })
            }
          },
          'fail': function(res) {}
        })
      }
    })
  },
  // 定义DY 获取用户信息函数----
  ObtainUserInfo: function() {
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
  //定义DY 获取小店累计收入函数----
  ShopProfit: function() {
    let _this = this
    wx.request({
      url: ListUrl_6,
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
          HeMoney: JSON.parse(res.data).data || '**.00'
        })
      }
    })
  },
  // 定义DY 购物车中数据是否为空
  ShopNull: function() {
    let _this = this;
    let shopNu = _this.data.shopCartDataList
    console.log(shopNu)
    for (let i in shopNu) {
      if (shopNu[i].movieStatus == true) {
        _this.setData({
          shopNuStatus: false
        })
        return
      } else {
        _this.setData({
          shopNuStatus: true
        })
      }
    }
    console.log(this.shopNuStatus)
  },
  // 定义DY 分享接口
  shareMiniPro:function(){
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {
    //执行ZX 消息列表动画函数执行
    // this.PushMessage()
    //执行ZX 获取用户信息函数
    this.ObtainUserInfo()
    //执行ZX 获取小店累计收入函数
    this.ShopProfit()
    //判断购物车是否有商品
    this.ShopNull()
    //执行ZX 小程序分享
    this.shareMiniPro()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //判断购物车是否有商品
    this.ShopNull()
    //执行ZX 消息列表动画函数执行
    // this.PushMessage()
    //执行ZX 获取用户信息函数
    this.ObtainUserInfo()
    //执行ZX 获取小店累计收入函数
    this.ShopProfit()
    //判断购物车是否有商品
    this.ShopNull()
    //执行ZX 小程序分享
    this.shareMiniPro()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  // 开店
  onPageScroll: function(e) {
    console.log(e); //{scrollTop:99}
    if (e >= 300) {
      this.setData({
        dp: false
      })
      console.log(1)
    } else {
      this.setData({
        dp: true
      })
      console.log(2)
    }
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
    console.log(this.data.shareList)
    let title = this.data.shareList.title
    let imageUrl = this.data.shareList.picUrl
    let path = this.data.shareList.path
    return {
      title: title,
      imageUrl: imageUrl,
      path: path
    }
  }

})