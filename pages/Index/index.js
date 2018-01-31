import Promise from '../../utils/blue'
import h from '../../utils/url.js'
var app = getApp()
Page({
    data: {
        role:'',
        loadingHidden:false,
        // WH
        SE_name:[],
        del_Nmae:[],
        recycleBySE:{},
        ListTotal:2,
		recycleList:[{"ShipmentEnterprise":'物流商A',"orderAmount":'3'},{"ShipmentEnterprise":'物流商B',"orderAmount":'2'}],
        // AP
        current:0,
        batteryStock:[],
        changeTabStock:[],
        "orderState":['待回收','已派单','已完成','未回收','已取消'],
        // SE
        RecyclingAmount:'',
        RecyclingList:[],
        wantCancel:false,
        cancelwhy:''
        },
	onLoad: function () {
            this.setData({
                role: app.globalData.userRole
            })
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
        var that = this
        this.setData({
                ifDisabled:true,
                ifFocus:false,
                ifShowBt:false,
                stockAmount: app.globalData.batteryStock,
                role: app.globalData.userRole
            })
            console.log('index onshow----')
            console.log(this.data.role)
            if(this.data.role==1){
                console.log('供应商进去--------')
            //AP
            //获取供应商订单列表
            wx.request({
            url: h.main+'/main/orderlistforId.html',
            data: {
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            success: function (res) {
                switch(res.data)
                {
                case 8:
                wx.showModal({    
                    title:'提示',    
                    content: '对不起,当前的账户已被挤掉!',   
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {
                            wx.navigateTo({
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                //清空以前的
                that.setData({
                    changeTabStock:[],
		        })
                console.log('batteryStock--------')
                console.log(res.data)
                that.setData({
				    batteryStock:res.data
			    });
                console.log(that.data.current)
                
                if(that.data.current==2){
                    console.log('完成回收里----')
                    res.data.map(function(item){
                        if(item.status==3 || item.status==7){
                            that.data.changeTabStock.push(item)
                        }
                    })
                }else{
                    console.log('其他里----')
                    res.data.map(function(item){
                    if(item.status==that.data.current+1){
                        that.data.changeTabStock.push(item)
                    }
                })
                }
                console.log(that.data.changeTabStock)

                var tempList = that.data.changeTabStock
                that.setData({
                    changeTabStock:tempList,
                    loadingHidden: true
		        })  
                }
                 

            },
            fail: function (res) {
                // console.log(res)
            },
            complete: function (res) {
                // console.log(res)
            }
            }) 
            }
            else if(this.data.role==2){
            //获取物流商回单列表 
            wx.request({
            url: h.main+'/page/listById.html',
            method: 'GET',
            data: {
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
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
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('回单信息---');
                console.log(res.data);
                that.setData({
                    RecyclingAmount: res.data.length,
                    RecyclingList:res.data,
                    loadingHidden: true
                })
                }
            }
        });
        }
        else{
            //仓库管理员回单列表 
            wx.request({
            url: h.main+'/page/listbygroup.html',
            method: 'GET',
            data: {
                laccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
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
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('仓库管理员回单列表---');
                console.log(res);
                var len = res.data.length
                var totalInfo=res.data
                var delNmae = totalInfo.splice(len-1,1)
                var onlyName=totalInfo
                
                // console.log('onlyName---');
                // console.log(onlyName)
                // console.log('delNmae---');
                // console.log(delNmae)
                onlyName.map(function(item){
                    that.data.SE_name.push(item)
                })
                delNmae.map(function(item){
                    that.data.del_Nmae.push(item)
                })
                var _recycleBySE={}
                _recycleBySE.name=onlyName
                _recycleBySE.delname=delNmae
                 console.log('_recycleBySE---');
                console.log(_recycleBySE)
                that.setData({
                     recycleBySE:_recycleBySE,
                    loadingHidden: true
                })

                }
            }
        });
        }
    },
    // SP
    changeTab: function(e) {
        //清空原来的订单列表
        this.setData({
                changeTabStock:[],
		    })
        var cur = parseInt(e.currentTarget.dataset.index);
        console.log(cur)
        var _that=this
        if(cur==2){
            this.data.batteryStock.map(function(item){
                if(item.status==3 || item.status==7 ){
                    _that.data.changeTabStock.push(item)
                }
            })
        }else{

        this.data.batteryStock.map(function(item){
            if(item.status==cur+1){
                _that.data.changeTabStock.push(item)
            }
        })
        }

        var tempList = this.data.changeTabStock
            console.log('符合的----')
            console.log(this.data.changeTabStock)
            this.setData({
                changeTabStock:tempList,
			    current: cur
		    })
        },
        
    //显示取消提交原因框
    cancelOrderPre: function(e){
        this.setData({
            wantCancel:true,
            cancelOrderno:this.data.changeTabStock[e.currentTarget.dataset.index].orderno,
            cancelwhy:''
        })
    },
    cancelBack: function(){
        this.setData({
            wantCancel:false
        })
    },
    inputCancelReason: function(e){
        this.setData({
            cancelwhy:e.detail.value
        })

    },
    // 取消订单
    cancelOrder: function() {    
             var that = this
           //取消原因为空时
           if(this.data.cancelwhy==null || this.data.cancelwhy==''){
            wx.showModal({    
                    title:'提示',    
                    content: '请填写取消原因！',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {
                        }    
                    }    
                });
            return
           }  
           wx.request({
                    url: h.main+'/main/ordercancel.html',
                    method: 'GET',
                    data: {
                        // orderno:that.data.changeTabStock[e.currentTarget.dataset.index].orderno,
                        orderno:this.data.cancelOrderno,
                        saccountno:app.globalData.accountName,
                        cancelwhy:this.data.cancelwhy,
                        sessionid: app.globalData.sessionid
                    },
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
                                    url: '../Login/index'
                                    })      
                                }    
                            }    
                        }); 
                        break;
                        default:
                        console.log('取消订单---');
                        console.log(res.data);
                        wx.showToast({
                            title: '取消成功！'
                        });
                        wx.request({
                    url: h.main+'/main/orderlistforId.html',
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
                                    url: '../Login/index'
                                    })      
                                }    
                            }    
                        }); 
                        break;
                        default:
                        //清空以前的
                        that.setData({
                            changeTabStock:[],
                        })
                        var _that=this
                        that.setData({
                            batteryStock:res.data
                        });
                        res.data.map(function(item){
                            if(item.status==that.data.current+1){
                                that.data.changeTabStock.push(item)
                            }
                        })
                        var tempList = that.data.changeTabStock
                        that.setData({
                            changeTabStock:tempList
                        })
                        //    更新库存
                        wx.request({
                        url: h.main+'/page/infaty.html',
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
                                        url: '../Login/index'
                                        })      
                                    }    
                                }    
                            }); 
                            break;
                            default:
                            app.globalData.batteryStock=res.data[0].inventory
                            }
                        },
                        fail: function () {
                            console.error("get Stock failed")
                        },
                        complete: function () {
                            // complete
                        }
                        })

                        }
                    },
                    fail: (res)=> {
                        // fail
                    },
                    complete: (res)=> {
                        that.setData({
                            wantCancel:false
                        })
                    }
                        })
                        }
                    }
                });
        
        
    },
// 订单详细页
    SP_goDetail: function (e) {
		wx.navigateTo({
			 url: '../SP/OrderDetail/index?orderno='+this.data.changeTabStock[e.currentTarget.dataset.index].orderno
            
		});
	},
//下拉刷新
    onPullDownRefresh(){
        console.log('onPullDownRefresh-----')
        var that = this
        console.log('index onshow----')
        console.log(this.data.role)
        this.setData({
                ifDisabled:true,
			    ifFocus:false,
			    ifShowBt:false,
                stockAmount: app.globalData.batteryStock
            })
            if(this.data.role==1){
                console.log('供应商进去--------')
            //AP
            //获取供应商订单列表
            wx.request({
            url: h.main+'/main/orderlistforId.html',
            data: {
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            success: function (res) {
                wx.stopPullDownRefresh()
                switch(res.data)
                {
                case 8:
                wx.showModal({    
                    title:'提示',    
                    content: '对不起,当前的账户已被挤掉!',   
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {
                            wx.navigateTo({
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                //清空以前的
                that.setData({
                    changeTabStock:[],
		        })
                console.log('batteryStock--------')
                console.log(res.data)
                that.setData({
				    batteryStock:res.data
			    });
                console.log(that.data.current)
                
                if(that.data.current==2){
                    console.log('完成回收里----')
                    res.data.map(function(item){
                        if(item.status==3 || item.status==7){
                            that.data.changeTabStock.push(item)
                        }
                    })
                }else{
                    console.log('其他里----')
                    res.data.map(function(item){
                    if(item.status==that.data.current+1){
                        that.data.changeTabStock.push(item)
                    }
                })
                }
                console.log(that.data.changeTabStock)

                var tempList = that.data.changeTabStock
                that.setData({
                    changeTabStock:tempList,
                    loadingHidden: true
		        })  
                }
                 

            },
            fail: function (res) {
                // console.log(res)
            },
            complete: function (res) {
                // console.log(res)
            }
            }) 
            }
            else if(this.data.role==2){
            //获取物流商回单列表 
            wx.request({
            url: h.main+'/page/listById.html',
            method: 'GET',
            data: {
                saccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
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
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('回单信息---');
                console.log(res.data);
                that.setData({
                    RecyclingAmount: res.data.length,
                    RecyclingList:res.data,
                    loadingHidden: true
                })
                }
            }
        });
        }
        else{
            //仓库管理员回单列表 
            wx.request({
            url: h.main+'/page/listbygroup.html',
            method: 'GET',
            data: {
                laccountno:app.globalData.accountName,
                sessionid: app.globalData.sessionid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
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
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('仓库管理员回单列表---');
                console.log(res);
                var len = res.data.length
                var totalInfo=res.data
                var delNmae = totalInfo.splice(len-1,1)
                var onlyName=totalInfo
                // console.log('onlyName---');
                // console.log(onlyName)
                // console.log('delNmae---');
                // console.log(delNmae)
                onlyName.map(function(item){
                    that.data.SE_name.push(item)
                })
                delNmae.map(function(item){
                    that.data.del_Nmae.push(item)
                })
                var _recycleBySE={}
                _recycleBySE.name=onlyName
                _recycleBySE.delname=delNmae
                 console.log('_recycleBySE---');
                console.log(_recycleBySE)
                that.setData({
                     recycleBySE:_recycleBySE,
                    loadingHidden: true
                })

                }
            }
        });
        }
    },
        
    // WH
    WH_goDetail: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index);
        var Id = this.data.recycleBySE.delname[0][idx].laccountno
		wx.navigateTo({
			url: '../WH/RecycleDetail/index?id='+Id
		});
	},
    WH_toSearch: function () {
		wx.navigateTo({
			url: '../WH/Search/index'
		});
	},
    //SE
    SE_goDetail: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index);
        //console.log(this.data.RecyclingList[idx].id)
        var Id = this.data.RecyclingList[idx].id

        console.log(Id)
		wx.navigateTo({
			url: '../SE/OrderList/index?id='+Id
            
		});
	},
    
});