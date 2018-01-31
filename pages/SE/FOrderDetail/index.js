import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        loadingHidden:false,
        orderInfo:{},
        BatteryList:'',
        reason:''
    },
    onLoad: function(options) {
          this.setData({
            orderno: options.id
          })
          var that =this
          wx.request({
            url: h.main+'/main/insertbattery.html', 
            data: {
                orderno: options.id,
                sessionid: app.globalData.sessionid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: (res)=> {
              console.log('订单详情-----')
              console.log(res.data)
                switch(res.data)
                {
                case 8:
                wx.showModal({    
                    title:'提示',    
                    content: '您目前的账户在另外登录!',  
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {
                            wx.navigateTo({
                              url: '../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                res.data.list2[1][0].submitdate1=util.getMyDate(res.data.list2[1][0].submitdate.time)
                that.setData({
                    orderInfo:res.data.list2[1][0],
                    BatteryList:res.data.list2[0],
                    loadingHidden:true,
                })
                }
                  
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
            }) 
        
    },
    onShow: function () {
        

    },
    // 修改
    changeReason: function(e){
      this.setData({
        reason:e.detail.value
      })
    },
    // 提交原因
    submitApply: function(e){
      this.setData({
        loadingHidden: false
      })
      wx.request({
        url: h.main + '/main/recyforwhy.html',
        data: {
          recyforwhy: this.data.reason,
          orderno: this.data.orderno,
          sessionid: app.globalData.sessionid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        success: (res) => {
          switch (res.data) {
            case 8:
              wx.showModal({
                title: '提示',
                content: '您目前的账户在另外登录!',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../../Login/index'
                    })
                  }
                }
              });
              break;
            default:
              console.log(res.data)
              this.setData({
                loadingHidden: true
              })
              wx.navigateBack({
                delta:1
              })
          }
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })

    }
    

})