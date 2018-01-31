var util = require('../../../utils/util.js')
import h from '../../../utils/url.js'
var app = getApp()

Page({
    data: {
       loadingHidden:false,
       canDo: false,
       maxApplyAmount:app.globalData.batteryStock,
    //    stockIndex:0,
       date:'',
       addrIndex:0,
       addressList:[],
       selectAddressList:[],
       hasAddr:true,
       applyAmount:'',
       kindF:[],
       kindFIndex:0,
    }, 
    onShow: function () {
      var nowDate = util.getNextDay(new Date())

          //获取地址列表
            var that = this
            wx.request({
            url: h.main+'/main/listByaddress2.html',
            data: {
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

            success: function (res) {
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
                console.log('address data--------')
                console.log(res.data)
                var addressLists=res.data[0]
                if(res.data[2]){
                    addressLists.push(res.data[2][0])
                }
                
                console.log(addressLists)
                // var selectAddressList=addressLists
                addressLists.map(function(item){
                        if(!item.province){
                            item.selectList=item.city+item.region+item.sblock
                        }else{
                        item.selectList=item.province+item.city+item.region+item.town+item.sblock
                    }
                })
                console.log('addressLists----')
                console.log(addressLists)

                that.setData({
                    addressList: addressLists,
                    kindF: res.data[1],
                    date: nowDate,
                    loadingHidden: true,
                })
               
                if(that.data.addressList.length<=0){
                   
                    console.log(that.data.addressList.length)
                    that.setData({
                        hasAddr: false
                        
                    })
                }else{
                    that.setData({
                        hasAddr: true
                    })
                }
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
    // stockPickerChange:function(e){  
    //     this.setData({  
    //         stockIndex: e.detail.value  
    //     })  
    // },
    addrPickerChange:function(e){  
        this.setData({  
            addrIndex: e.detail.value  
        })  
    },
    KindFPickerChange:function(e){  
        this.setData({  
            kindFIndex: e.detail.value  
        })  
        console.log('addrIndex---'+this.data.addrIndex)
    },
    changeApplyAmount:function(e){ 
        this.setData({  
                applyAmount: e.detail.value  
        }) 
    },
    bindDateChange: function(e){
      this.setData({
        date: e.detail.value
      })
    },
    submitApply:function(e){
        this.setData({
                loadingHidden:false,
                canDo: true
                }) 
        var that = this
        var applyDate = new Date()
        if(this.data.addressList.length<=0){
            wx.showModal({    
                    title:'提示',    
                    content: '请添加回收地址信息！',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {
                            this.setData({
                                loadingHidden:true,
                                canDo: false
                            })  
                        }    
                    }    
                });
            return
        }

        console.log(parseInt(this.data.applyAmount))
        if(parseInt(this.data.applyAmount)>parseInt(app.globalData.batteryStock)){
            console.log('数量大于库存')   
            wx.showModal({    
                    title:'提示',    
                    content: '申请数量大于您的库存数量',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {
                            this.setData({
                                loadingHidden:true,
                                canDo: false
                            })  
                        }    
                    }    
                });
                return

        }else{
            if(parseInt(this.data.applyAmount.trim())<=0 || this.data.applyAmount.trim()==''){
                console.log('数量<0')
                wx.showModal({    
                    title:'提示',    
                    content: '申请数量必须大于0',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) { 
                            this.setData({
                                loadingHidden:true,
                                canDo: false
                            })
                        }    
                    }    
                });
                return
            }
            console.log('数量符合')
            
         wx.request({
            url:  h.main+"/main/orderInsert.html",
            data: {
             material:this.data.kindF[this.data.kindFIndex].materialname,
             snumber:this.data.applyAmount,
             username:this.data.addressList[this.data.addrIndex].username,
             smobile:this.data.addressList[this.data.addrIndex].smobile,
             province: this.data.addressList[this.data.addrIndex].province==null?'':this.data.addressList[this.data.addrIndex].province,
			 sarea: this.data.addressList[this.data.addrIndex].city,
			 region: this.data.addressList[this.data.addrIndex].region,
			 town:this.data.addressList[this.data.addrIndex].town || "",
             sblock:this.data.addressList[this.data.addrIndex].sblock || "",
             saccountno:app.globalData.accountName,
             sessionid: app.globalData.sessionid,
             orderingDate:this.data.date


             //id:this.data.addressList[this.data.addrIndex].id,
            //  oppen_id: app.globalData.oppenid,
             //submitdate:util.formatTime(applyDate)

            },
            
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
               'content-type': 'application/x-www-form-urlencoded' ,
                'Accept': 'application/json'
            }, // 设置请求的 header
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
                console.log('apply result-----------');
              console.log(res.data);
              if(res.data==0){
                  wx.showToast({
				    title: '提交成功！'
			        });
         //app.globalData.batteryStock-=that.data.applyAmount                     
                    wx.switchTab({
                        url: '../../Index/index'
                    })

                    this.setData({
                      loadingHidden: true,
                      canDo: false
                    })
               }else{
                   wx.showModal({    
                    title:'提示',    
                    content: '提交失败!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: (res) => {   
                        if (res.confirm) {       
                        }    
                    }    
                });
                   this.setData({
                     loadingHidden: true,
                     canDo: false
                   })
               }
                }
              
                

            },
            fail: (res)=> {
              // fail
               wx.showModal({    
                    title:'提示',    
                    content: '提交失败!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                });
               this.setData({
                 loadingHidden: true
               })
            },
            complete: (res)=> {
              
                
            }
          })
        }


    },
    toAddAddr:function(){
        wx.navigateTo({
            url: '../address/add/add'
        });
    }

	
});