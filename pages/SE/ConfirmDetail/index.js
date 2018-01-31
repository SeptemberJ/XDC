import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        loadingHidden:false,
        canDo:false,
        contactInfo:{},
        attachInfo:{},
        BatteryList:'',
        submitArry:''
    
    },
    onLoad: function(options) {
        // 获取localstorage里物流商填写的信息
        wx.getStorage({
            key: 'confirmInfo',
            success: (res)=>{
                console.log('attach----')
                console.log(res.data)
                this.setData({
                    contactInfo:res.data.contactInfo,
                    BatteryList:res.data.BatteryList.batteryList,
                    attachInfo:res.data.attachInfo,
                    submitArry:res.data.BatteryList,
                    loadingHidden:true,
                })
            } 
        })
        console.log(this.data.BatteryList)
    },
    onShow: function (options) {
    
    },
    // 返回编辑
    backEdit: function(){
        wx.navigateBack({
            delta: 1
        })
    },

    // 确认提交
    confirmSubmit: function () {
      this.setData({
        loadingHidden:false,
        canDo:true
      })
        wx.request({
            url: h.main+'/main/orderlisttijiao1.html',
            method: 'GET',
            data: {
                orderno:this.data.contactInfo.orderno,
                triplicate:this.data.attachInfo.triplicate,
                //status1:this.data.attachInfo.status1,
                why:this.data.attachInfo.why,
                Infor:JSON.stringify(this.data.submitArry),
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
           header: {
                'content-type': 'application/x-www-form-urlencoded'
                
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
                console.log('物流商确认订单成功-----');
                console.log(res.data);
                this.setData({
                  loadingHidden: true
                })
                wx.showToast({
                    title: '保存成功',
                    duration: 500
			    });
                // 等待半秒，toast消失后返回上一页
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 2
                    })
                }, 500);
                }
                
            }
        });
    },
    

})