import Promise from '../../../utils/blue'
import h from '../../../utils/url.js'
var app = getApp()
Page({
    data: {
		ifDisabled:true,
		ifShowBt:false,
		ifFocus:false,
    stockAmount:'',
    SPname: ''
    },
	onLoad: function () {

        var that = this
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function (userInfo) {
        //     //更新数据
        //     // console.log(userInfo);
        //     that.setData({
        //         userInfo: userInfo
        //     })
        // })
    },
    onShow: function (e) {

        this.setData({
			    ifDisabled:true,
			    ifFocus:false,
			    ifShowBt:false,
			    stockAmount: app.globalData.batteryStock,
          SPname: app.globalData.SPname
        })
    },

    changeAmount: function (e) {
        this.setData({
                stockAmount:e.detail.value
            })
    },
    edit: function (e) {
		this.setData({
      		ifDisabled:false,
			ifFocus:true,
			ifShowBt:true,
        });
	},
    cancel: function () {
        this.setData({
      		ifDisabled:true,
			ifFocus:false,
			ifShowBt:false,
            stockAmount:app.globalData.batteryStock
    });
    },
	saveStock: function (e) {
        wx.request({
            url: h.main+'/page/upfqty.html',
            data: {
                inventory:this.data.stockAmount,
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: (res)=> {
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
                console.log('save stock data--------')
                console.log(res.data)
                wx.showToast({
				title: '保存成功！'
                });
                this.setData({
                    ifDisabled:true,
                    ifFocus:false,
                    ifShowBt:false,
                });
                app.globalData.batteryStock=this.data.stockAmount
                }
                
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
            })
        // wx.showToast({
		// 		title: '保存成功！'
		// 	});
        
		// this.setData({
      	// 	ifDisabled:true,
		// 	ifFocus:false,
		// 	ifShowBt:false,
        //  });
        //  app.globalData.batteryStock=this.data.stockAmount
        //  request this.data.stockAmount 发送新库存数据
	},
	
});