import h from '../../../utils/url.js'
var app = getApp()
Page({
  data: {
    // KindIndexArrayF:[0],
    // KindIndexArrayS:[0],
    KindIndexArrayF:[],
    KindIndexArrayS:[],
    orderInfo:{},
    resultIndex:0,
    results:["完成回收","未回收"],
    amountTotal:0,
    batteryKindF:[],
    batteryKindS:[],
    ThreeNumber:''
  },
  onLoad: function (options) {
    var that = this
    // 订单信息
    wx.request({
            url: h.main+'/main/orderupsert1.html',
            method: 'GET',
            data: {
                orderno:options.id,
                sessionid: app.globalData.sessionid
            },
            header: {
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
                console.log('物流商订单详情==');
                console.log(res.data);
                this.setData({
                    orderInfo: res.data[0]
                })
                }
                
            }
        });
        // 获取电池种类
            wx.request({
            url: h.main+'/main/material.html',
            method: 'GET',
            data: {
                sessionid: app.globalData.sessionid
            },
            header: {
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
                console.log('获取电池种类==');
                console.log(res.data.OrderInfoList);
                const firstColumn = []
                const secondColumn = []
                const tempColumn = []
                res.data.OrderInfoList.map(function(item){
                    firstColumn.push(item.Order.MATERIALNAME)
                    tempColumn.push(item.Order.OrderEntry)
                })
                tempColumn.map(function(item){
                    const tempEachKindS = []
                    item.map(function(it){
                        tempEachKindS.push(it.MATERIALNAME)
                    })
                    secondColumn.push(tempEachKindS)
                    
                })
                console.log(firstColumn);
                console.log(tempColumn);
                console.log(secondColumn);
                this.setData({
                    batteryKindF: firstColumn,
                    batteryKindS:secondColumn
                })
                }
                
            }
        });

  },
  
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
    // changeThreeNumber
    changeThreeNumber: function(e){
        this.setData({  
            ThreeNumber: e.detail.value
        }) 
    },

    // 改变一级目录
    KindPickerChangeF:function(e){ 
      var Id = e.currentTarget.id
      var val = e.detail.value
      var newKindAll = this.data.KindIndexArrayF
      newKindAll.splice(Id,1,val)  
        this.setData({  
            KindIndexArrayF: newKindAll
        })  
    },
    // 改变二级目录
    KindPickerChangeS:function(e){ 
      var Id = e.currentTarget.id
      var val = e.detail.value
      var newKindAll = this.data.KindIndexArrayS
      newKindAll.splice(Id,1,val)  
        this.setData({  
            KindIndexArrayS: newKindAll
        })  
    },
    // 改变回收结果
    resultPickerChange:function(e){  
        this.setData({  
            resultIndex: e.detail.value  
        })
        if(this.data.resultIndex==1){
            this.setData({  
            KindIndexArrayF: [],
            ThreeNumber:'无'  
            })
            console.log('ThreeNumber--'+this.data.ThreeNumber)

        }  
        console.log(this.data.resultIndex)
    },
    // 删除一类
    delOneKind:function(e){ 
        var Id = e.currentTarget.id
        var KindArrayF = this.data.KindIndexArrayF
        var KindArrayS = this.data.KindIndexArrayS
        KindArrayF.splice(Id,1) 
        KindArrayS.splice(Id,1)
        
        this.setData({  
                KindIndexArrayF:KindArrayF,
                KindIndexArrayS:KindArrayS
            }) 
    },
    // 增加一类
    addOne: function () {
        console.log('addOneKind----')
        console.log(this.data.KindIndexArrayF) 
        var KindArrayF = this.data.KindIndexArrayF
        var KindArrayS = this.data.KindIndexArrayS
        KindArrayF.push('0')
        KindArrayS.push('0')
        this.setData({
                resultIndex: 0,
                ThreeNumber:'',  
                KindIndexArrayF:KindArrayF,
                KindIndexArrayS:KindArrayS
            }) 
    },
    // 提交确认
    formSubmit: function(e) {
      var len = this.data.KindIndexArrayF.length
      var submitArry={}
      var batteryInfo=[]
      var attachInfo={}
      for(var i=0;i<len;i++){
        var obj={}
        obj.btype=this.data.batteryKindF[e.detail.value['kindF'+i]]+this.data.batteryKindS[e.detail.value['kindF'+i]][e.detail.value['kindS'+i]]
        obj.number=e.detail.value['amount'+i]||''
        obj.lweight=e.detail.value['weight'+i]||''
        // 电池数量和总量不能为空
		if (obj.number == "" || obj.lweight == "") {
			wx.showModal({    
                    title:'提示',    
                    content: '电池数量和重量不能为空!',  
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {       
                        }    
                    }    
                });    
                // return false;
			return;
		}
        batteryInfo.push(obj) 
        submitArry.batteryList=batteryInfo
      }
      console.log('submitArry------')
      console.log(submitArry)
    //   console.log(JSON.stringify(submitArry))
    var confirmInfo={}
    attachInfo.triplicate=e.detail.value.threeNumber,
    attachInfo.status1=this.data.results[this.data.resultIndex],
    attachInfo.why=e.detail.value.reason,
    confirmInfo.contactInfo=this.data.orderInfo
    confirmInfo.attachInfo=attachInfo
    confirmInfo.BatteryList=submitArry
    // 三联单号不能为空
		if (attachInfo.triplicate == "") {
			wx.showModal({    
                    title:'提示',    
                    content: '三联单号不能为空!',  
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {       
                        }    
                    }    
                });    
                // return false;
			return;
		}
      wx.setStorage({
        key:"confirmInfo",
        data:confirmInfo
      })
      wx.navigateTo({
			url: '../ConfirmDetail/index'
      });

    },


    calculateAmountTotalDel: function(e) {
        console.log("bindfocus---")
        var amountToatl = this.data.amountTotal-parseInt(e.detail.value)
        this.setData({
        amountTotal:amountToatl
        })
     },
     calculateAmountTotalAdd: function(e) {
        console.log("bindblur---")
        var amountToatl = this.data.amountTotal+parseInt(e.detail.value)
        this.setData({
        amountTotal:amountToatl
        })
     },
  

})