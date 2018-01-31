import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        loadingHidden:false,
        orderInfo:{},
        BatteryList:'',
    
    },
    onLoad: function(options) {
            var that =this
            wx.request({
            url: h.main+'/main/insertbattery.html', 
            data: {
                orderno: options.orderno,
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
                console.log('back orderInfo--------')
                console.log(res.data)
                console.log(res.data.list2)
                //秒数回转
                // res.data.list2[1][0].curdate1=util.getMyDate(res.data.list2[1][0].curdate.time)
                res.data.list2[1][0].submitdate1=util.getMyDate(res.data.list2[1][0].submitdate.time)
                this.setData({
                    orderInfo:res.data.list2[1][0],
                    BatteryList:res.data.list2[0],
                    loadingHidden:true,
                })
                }
                
            },
            fail: (res)=> {
                // fail
            },
            complete: (res)=> {
                // complete
            }
            }) 
        
    },
    onShow: function (options) {
        

    },


})