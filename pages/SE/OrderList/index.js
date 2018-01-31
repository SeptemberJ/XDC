import Promise from '../../../utils/blue'
import h from '../../../utils/url.js'
var app = getApp()
Page({
    data: {
        loadingHidden:false,
        orderTab:['未完成','已完成'],
        currnet:0,
        orderListAll:[],
        orderList:[],
        optionsId:''
        
        },
	onLoad: function (options) {
        this.setData({
          optionsId: options.id
        })
    },
    onShow:function(){
        this.setData({
          loadingHidden: false
        })
        var that = this
        wx.request({
            url: h.main+'/page/listByOrderno.html',
            data: {
                rec_id:this.data.optionsId,
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
                //清空以前的
                this.setData({
                    orderList:[],
                })
                console.log('物流商订单列表--------')
                console.log(res.data)
                console.log(this.data.currnet)
                var nowCur= this.data.currnet
                var _that=this
                this.setData({
                  orderListAll:res.data
                });
                res.data.map(function(item){
                    if(nowCur==0){
                        if(item.status==2){
                        _that.data.orderList.push(item)
                        }
                    }else{
                        if(item.status!=2){
                        _that.data.orderList.push(item)
                        }
                    }
                })
                var tempList = this.data.orderList
                this.setData({
                    orderList:tempList,
                    loadingHidden: true
		        })   
                }
                
            },
            fail: (res) => {
                // fail
            },
            complete: (res)=> {
              this.setData({
                loadingHidden: true
              })
            }
         })

    },
    // tab点击
    changeTab: function(e) {
        //清空原来的订单列表
        this.setData({
                orderList:[],
		    })
        var cur = parseInt(e.currentTarget.dataset.index);
        console.log(cur)
        var _that=this
        this.data.orderListAll.map(function(item){
            if(cur==0){
                if(item.status==2){
                _that.data.orderList.push(item)
                }
            }else{
                if(item.status!=2){
                _that.data.orderList.push(item)
                }
            }
        })
        var tempList = this.data.orderList
            console.log('符合的----')
            console.log(this.data.orderList)
            this.setData({
                orderList:tempList,
			    currnet: e.target.dataset.index
		    })

        //  this.setData({
		// 	currnet: e.target.dataset.index
		// })
    },
    // 跳转详细
    goToDetail: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index)
        var Id = this.data.orderList[idx].orderno
        console.log('Id++++++'+Id)
        if(this.data.orderList[idx].status==2){
            wx.navigateTo({
            url: '../OrderDetail/index?id='+Id
		    });
        }else{
            wx.navigateTo({
            url: '../FOrderDetail/index?id='+Id
		    });
        }
		
	},
	
	
});