// pages/home/home.js
// 声明SM 调用接口声明
var ListUrl = getApp().globalData.WX_user + getApp().globalData.wx_url_2
var ListUrl_3 = getApp().globalData.WX_user + getApp().globalData.wx_url_3
var ListUrl_5 = getApp().globalData.WX_user + getApp().globalData.wx_url_5
var ListUrl_6 = getApp().globalData.Wx_rebate + getApp().globalData.wx_url_6
var ListUrl_7 = getApp().globalData.WX_user + getApp().globalData.wx_url_7
var ListUrl_8 = getApp().globalData.WX_user + getApp().globalData.wx_url_8
var ListUrl_9 = getApp().globalData.WX_user + getApp().globalData.wx_url_9
var ListUrl_10 = getApp().globalData.WX_user + getApp().globalData.wx_url_10
var ListUrl_11 = getApp().globalData.WX_user + getApp().globalData.wx_url_11
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化视频列表
    movieList: [],
    // 推荐人ID
    userInfo: [],
    // 用户广告消息是否显示
    userAdvNews: false,
    // 购物车是否有数据
    shopCart: false,
    //购物车数据
    shopCartDataList: [{
      movieName: '占位',
      movieStatus: false,
    }, ],
    // 购物车是否有商品
    shopStatus: true,
    //购物车弹窗是否显示
    shopPopup: false,
    // 购物车商品总数
    shopCartIndexI: '',
    // 购物车商品总价钱
    shopCartIndexMoney: '',
    // banner处显示的视频地址
    videoState: "http://61.133.53.18/data/cdn_transfer/99/91/9996ec06155550c94e7b02214b4c1cbefa330a91.mp4",
    // 购物车是否为空 空则显示灰色，否则显示具体内容
    shopNuStatus: true,
    // 初始化推荐人头像
    HeheadPicUrl: '../../images/head_url.png',
    // 根据滑动距离决定“我也要开店的位置”-已废弃
    dp: false,
    // 初始化小店累计收入
    HeMoney: '**.00',
    // 我的推广和未推广的切换状态
    title_set: '',
    // 我要开店和去赚钱状态
    shopState: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //首先保留this的指向问题
    var _this = this;
    // 授权之后获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        _this.setData({
          userInfo: res.data
        })
        // 如果是从授权页面进入则直接调用支付
        if (options.Lo == 'login') {
          // 获取获取内的订单信息存在data
          wx.getStorage({
            key: 'PsyShopCartDataList',
            success: function(res) {
              _this.setData({
                shopCartDataList: res.data
              })
              // 执行ZX 支付函数执行
              _this.PayWec()
            },
          })
        }
      },
    })

    wx.getStorage({
      key: 'shopDian',
      success: function(res) {
        wx.getStorage({
          key: 'level',
          success: function(res_level) {
            if (res_level.data != 0) {
              if (res.data) {
                // 把从APP带来的user_id存入本地缓存
                wx.setStorage({
                  key: "refId",
                  data: _this.data.userInfo.userId
                })
                // 把从APP带来的user_id存入本地data
                _this.setData({
                  RefUserId: _this.data.userInfo.userId,
                  shopState: false
                })
              }
              // 执行ZX 求购物车当前的
              this.ShopCartIndexI()
              // 执行ZX 执行请求视频列表
              this.GetUserInfoHttpCallback()
              //判断购物车是否有商品
              this.ShopNull()
              //执行ZX 小程序分享
              this.shareMiniPro()

              return
            }
            else {
              _this.setData({
                showModal: true
              })
            }
          },
        })

      },
    })
    // 把从APP带来的user_id存入本地缓存
    wx.setStorage({
      key: "refId",
      data: options.user_id || '1'
    })
    // 把从APP带来的user_id存入本地data
    _this.setData({
      RefUserId: options.user_id || '1',
      shopState: true
    })
    // 执行ZX 求购物车当前的
    this.ShopCartIndexI()
    // 执行ZX 执行请求视频列表
    this.GetUserInfoHttpCallback()
    //判断购物车是否有商品
    this.ShopNull()
    //执行ZX 小程序分享
    this.shareMiniPro()
  },
  // 定义DY查看他以购买的视频
  ToTitleMy: function() {
    // 为回调保留this
    let _this = this
    // 请求已购买的接口
    wx.request({
      url: ListUrl_10,
      data: {
        limit: 10,
        offset: 0,
        total: '',
        userId: _this.data.RefUserId
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: res => {
        let movieList = res.data.data;
        _this.setData({
          movieList: movieList
        })
      }
    })
    // 把选中状态保存到data
    _this.setData({
      title_set: true
    })
  },
  // 定义DY 查看他未购买的视频
  ToTitleHe: function() {
    // 为回调保留this
    let _this = this
    // 请求未购买的接口
    wx.request({
      url: ListUrl_11,
      data: {
        limit: 10,
        offset: 0,
        total: '',
        userId: _this.data.RefUserId
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: res => {
        let movieList = res.data.data;
        _this.setData({
          movieList: movieList
        })
      }
    })
    // 把选中状态存入data
    this.setData({
      title_set: false
    })
  },
  // 定义DY 求购物车商品条数和总价
  ShopCartIndexI: function() {
    // 获取data里定义的购物车集合
    let cartList = this.data.shopCartDataList
    // 初始化总数量数组
    var shopNum = [0]
    // 初始化总价钱数组
    var shopMoney = [0]
    // 循环购物车商品
    for (let i in cartList) {
      if (cartList[i].movieStatus == true) {
        // 单个商品数量
        let cartDNmu = cartList[i].movieNum
        // 单个商品价钱s
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
    // 数组求和 购买总价
    const MoneySum = (shopMoney.reduce((a = 0, i) => a + Number(i))).toFixed(2)
    // 把总价钱和总数量存进data数据
    this.setData({
      shopCartIndexI: numSum,
      shopCartIndexMoney: MoneySum
    })
  },
  // 定义DY 购物车全部清空
  emptyFn: function() {
    // 声明购物车数据
    let cartList = this.data.shopCartDataList;
    // 遍历当前购物车中数据全变赋值为关闭状态
    for (let i in cartList) {
      cartList[i].movieStatus = false
    }
    // 得到的结果替换data中购物车数据
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
  // 定义DY 判断购物车中是否有商品
  shopTandF: function() {
    // 声明购物车中数据
    let shopList = this.data.shopCartDataList
    // 遍历购物车中数据
    for (let i in shopList) {
      // 判断购物车中数据是否为关闭状态
      if (shopList[i].movieStatus == false) {
        // 遍历视频列表中数据
        for (let j in this.data.movieList) {
          // 视频列表中数量变为0
          this.data.movieList[j].movieNum = 0;
          // 视频列表中减号状态变为隐藏
          this.data.movieList[j].movieStatus = false;
          // 购物车中商品状态变为0，隐藏
          this.data.shopCartDataList[i].movieNum = 0
        }
        // 把数据设置到data中
        this.setData({
          // 把视频列表数据设置到data中
          movieList: this.data.movieList,
          // 购物车是否有商品
          shopStatus: false,
          //购物车弹窗是否显示
          shopPopup: false,

        })
      } else {
        // 如果购物车中有大于等一1件商品，则购物车状态为开启状态
        this.setData({
          // 购物车是否有商品
          shopStatus: true,
          //购物车弹窗是否显示
          shopPopup: true,
        })
      }
    }
  },
  // 定义DY 获取视频列表的数据
  GetUserInfoHttpCallback: function() {
    // 保留this的指向
    var _this = this
    // 如果推荐人的ID为1则显示官方的小店 请求的接口为getOfficialRecommendation
    if (_this.data.RefUserId == 1) {
      wx.request({
        url: ListUrl_9,
        data: {
          limit: 0,
          offset: 0,
          total: '',
        },
        header: {
          'content-type': 'application/json', // 默认值
        },
        success: res => {
          let movieList = res.data.data;
          _this.setData({
            movieList: movieList
          })
        }
      })
    }
    // 如果推荐人ID不为1则显示为推荐人的小店 请求的接口为getMySpreadListByUserId
    else {
      wx.request({
        url: ListUrl,
        data: {
          limit: 10,
          offset: 0,
          total: '',
          userId: _this.data.RefUserId
        },
        // dataType: JSON,
        header: {
          'content-type': 'application/json', // 默认值
          // 'userid': _this.data.userInfo.userId,
          // 'terminal': 'MINIPRO',
          // 'ticket': _this.data.userInfo.ticket,
        },
        success: res => {
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
    // 执行ZX 把购物车数据存到本地缓存
    this.storageCache(this.data.shopCartDataList)
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
    // 执行ZX 把购物车数据存到本地缓存
    this.storageCache(this.data.shopCartDataList)
  },
  // 定义DY 点击出现购物车弹窗
  BindToPopup: function() {
    // 切换购物车弹窗的显示和隐藏
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
  // 定义DY 把购物车实时数据缓存到本地缓存
  storageCache: function(e) {
    wx.removeStorageSync('shopCartDataList')
    wx.setStorage({
      key: "shopCartDataList",
      data: e
    })
  },
  // 定义DY 点击视频列表中的减号
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
    // 执行ZX 把购物车数据存到本地缓存
    this.storageCache(this.data.shopCartDataList)
    // 执行ZX 求购物车商品条数
    this.ShopCartIndexI()
    // 执行ZX 计算每天商品的条数视频列表
    this.NumberCalculation()
    // 如果购物车数组中movieStatus全部为false则更改状态
    for (let i in this.data.shopCartDataList) {
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
        // 执行ZX 把购物车数据存到本地缓存
        this.storageCache(this.data.shopCartDataList)
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
      // 执行ZX 把购物车数据存到本地缓存
      this.storageCache(this.data.shopCartDataList)
      return
    }


  },
  // 定义DY 计算每天商品的条数视频列表*******
  NumberCalculation: function() {
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
  },
  // 定义DY 点击购买函数 点击之后执行
  BindToBuy: function(e) {
    // 保留this指向
    let _this = this
    wx.getSetting({
      success: function(res) {
        let grant = res.authSetting['scope.userInfo']
        // 如果已经授权则直接购买
        if (grant) {
          _this.PayWec()
        }
        // 如果未授权则跳转授权页面，同时缓存收据
        else {
          wx.setStorage({
            key: "PsyShopCartDataList",
            data: _this.data.shopCartDataList
          })
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      }
    })

  },
  // 定义DY 支付函数定义
  PayWec: function() {
    // 保留this指向
    let _this = this;
    // 获得购物车数据
    let shopCartDataList = this.data.shopCartDataList;
    // 初始化提交数组
    let Tobuy = [];
    // 循环购物车中数量不为零的数据
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
      "sellUserId": _this.data.RefUserId,
      "userId": _this.data.userInfo.userId
    }
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
        userId: _this.data.RefUserId,
      },
      // dataType: JSON,
      header: {
        'content-type': 'application/json', // 默认值
        // 'userid': _this.data.userInfo.userId,
        // 'terminal': 'MINIPRO',
        // 'ticket': _this.data.userInfo.ticket,
      },
      success: res => {
        this.setData({
          Nickname: res.data.data.nickname,
          HeId: res.data.data.id,
          HeheadPicUrl: res.data.data.localHeadPic,
          HehedLevel: res.data.data.level,
        })
      }
    })
  },
  // 定义DY 获取小店累计收入函数----
  ShopProfit: function() {
    let _this = this
    wx.request({
      url: ListUrl_6,
      method: "GET",
      data: {
        userId: _this.data.RefUserId,
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
  },
  // 定义DY 分享接口 zhelixuyaoxiugai
  shareMiniPro: function() {
    let _this = this
    wx.request({
      url: ListUrl_8,
      method: "GET",
      dataType: JSON,
      data: {
        userId: _this.data.RefUserId,
      },
      header: {
        'content-type': 'application/json', // 默认值
        // 'userid': userIDHE,
        // 'terminal': 'MINIPRO',
        // 'ticket': _this.data.userInfo.ticket,
      },
      success: res => {
        _this.setData({
          shareList: JSON.parse(res.data).data
        })
      }
    })
  },
  // 定义DY 点击开店按钮 -已废弃
  onPageScroll: function(e) {
    // 当距离头部高度大于等于300则为dp
    if (e >= 300) {
      this.setData({
        dp: false
      })
    } else {
      this.setData({
        dp: true
      })
    }
  },
  // 定义DY 弹窗显示
  showDialogBtn: function() {
    let _this = this
    if (this.data.HehedLevel > 0) {
      wx.getSetting({
        success: function(res) {
          // 当前时间戳
          let timestamp = Date.parse(new Date()) / 1000;
          // 查看是否授权过
          let grant = res.authSetting['scope.userInfo']
          if (grant) {
            wx.getStorage({
              key: 'level',
              success: function(res) {
                if (res.data != 0) {
                  // 把从APP带来的user_id存入本地缓存
                  wx.setStorage({
                    key: "refId",
                    data: _this.data.userInfo.userId
                  })
                  // 把从APP带来的user_id存入本地data
                  _this.setData({
                    RefUserId: _this.data.userInfo.userId,
                    shopState: false
                  })
                  // 执行ZX 求购物车当前的
                  _this.ShopCartIndexI()
                  // 执行ZX 执行请求视频列表
                  _this.ToTitleHe()
                  //判断购物车是否有商品
                  _this.ShopNull()
                  //执行ZX 小程序分享
                  _this.shareMiniPro()
                  //执行ZX 获取用户信息函数
                  _this.ObtainUserInfo()
                  return
                } else {
                  _this.setData({
                    showModal: true
                  })
                }
              },
            })

          } else {
            let shopDian = '2'
            wx.reLaunch({
              url: '/pages/login/login?shopDian=' + shopDian,
            });
          }
        }
      })

    } else {
      this.setData({
        showModal: true
      })
    }
  },
  // 定义DY 弹出框蒙层截断touchmove事件 禁止滑动
  preventTouchMove: function() {},
  // 定义DY 隐藏模态对话框
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  // 定义DY 弹窗蒙层
  hideModalshopPopup: function() {
    this.setData({
      shopPopup: false
    })
  },
  // 定义DY 对话框取消按钮点击事件
  onCancel: function() {
    this.hideModal();
  },
  // 定义DY 对话框确认按钮点击事件
  onConfirm: function() {
    this.hideModal();
  },
  // 定义DY 点击视频=>跳转详情
  // ToDet: function() {
  //   wx.navigateTo({
  //     url: '/pages/movieDet/movieDet',
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {
    //执行ZX 消息列表动画函数执行
    // this.PushMessage()
    //执行ZX 获取用户信息函数
    this.ObtainUserInfo()
    //执行ZX 获取小店累计收入函数
    if (this.data.RefUserId != 1) {
      this.ShopProfit()
    }
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
  showDialogSh: function() {
    this.onShareAppMessage
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
  },

  // 定义DY 消息列表动画函数定义
  // PushMessage: function () {
  //   // 重定向this值
  //   var _this = this;
  //   // 初始化声明一个i
  //   var i = 0
  //   // 初始化滑出页面
  //   var animationCloudData = wx.createAnimation({
  //     duration: 1000,
  //     timingFunction: 'ease-in-out',
  //     //transformOrigin: '4px 91px'
  //   });

  //   //动画的脚本定义必须每次都重新生成，不能放在循环外
  //   animationCloudData.translateX(200).step({
  //     duration: 2500
  //   }).opacity(0).step({
  //     duration: 1000
  //   });

  //   // 定义data数据。更新数据
  //   _this.setData({
  //     // 导出动画示例
  //     animationCloudData: animationCloudData.export(),
  //   })
  //   // 循环执行定时器-闪烁效果
  //   setInterval(function () {
  //     // i+1
  //     ++i;
  //     // 每次显示第几条
  //     var disInfo = Math.floor(i / 2);
  //     // data中总条目数目
  //     var disLen = (_this.data.indexList.length) - 1
  //     // 如果当前显示的条数大于等于总条目数
  //     if (disInfo >= disLen) {
  //       i = 0
  //     }
  //     //动画的脚本定义必须每次都重新生成，不能放在循环外
  //     animationCloudData.translateX(200).step({
  //       duration: 2500
  //     }).opacity(0).step({
  //       duration: 2500
  //     });
  //     //动画的脚本定义必须每次都重新生成，不能放在循环外
  //     animationCloudData.translateX(200).step({
  //       duration: 2500
  //     }).opacity(1).step({
  //       duration: 2500
  //     });
  //     // 更新数据
  //     _this.setData({
  //       // 导出动画示例
  //       animationCloudData: animationCloudData.export(),
  //       macMa: _this.data.indexList[disInfo]
  //     })
  //   }.bind(_this), 2500); //3000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错

  // },

})