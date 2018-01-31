
import h from '../../../utils/url.js'
var app = getApp()
Page({
    data: {
        priceList:{}
    },
	onLoad: function () {
    },
    onShow: function () {
        wx.request({
          url: h.main+'/main/listPrice.html',
          data: {
              saccountno:app.globalData.accountName,
              sessionid: app.globalData.sessionid
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: (res)=>{
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
                console.log(res.data)
                var priceList={}
                priceList.date=res.data[0]
                priceList.priceInfo=res.data[1]
                this.setData({
                    priceList:priceList
                })
              }
          },
          fail: (res)=>{
            // fail
          },
          complete: (res)=>{
            // complete
          }
        })
    },
    onPullDownRefresh(){
        wx.request({
          url: h.main+'/main/listPrice.html',
          data: {
              saccountno:app.globalData.accountName,
              sessionid: app.globalData.sessionid
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: (res)=>{
              wx.stopPullDownRefresh()
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
                console.log(res.data)
                var priceList={}
                priceList.date=res.data[0]
                priceList.priceInfo=res.data[1]
                this.setData({
                    priceList:priceList
                })
              }
          },
          fail: (res)=>{
            // fail
          },
          complete: (res)=>{
            // complete
          }
        })
    }

    
});