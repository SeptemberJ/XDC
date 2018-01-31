const AV = require('../../../../utils/av-weapp.js')
import h from '../../../../utils/url.js'
var app = getApp()
Page({
    data: {
        addressList:[],
        type:'',
        loadingHidden:true,
        // addressList:[]
        // hasAddr:true,

    },
        onShow: function () {
          //获取地址列表
            var that = this
            wx.request({
            url: h.main+'/main/listByaddress.html',
            data: {
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
                              url: '../../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('address data--------')
                console.log(res.data)
                var addressLists=res.data[0]
                if(res.data[1]){
                    addressLists.push(res.data[1][0])
                }
                
                console.log(addressLists)
                that.setData({
                    addressList: addressLists,
                })
                if(that.data.addressList.length<=0){
                   
                    console.log(that.data.addressList.length)
                    // that.setData({
                    //     hasAddr: false
                    // })
                }else{
                    console.log(that.data.addressList.length)
                    // that.setData({
                    //     hasAddr: true
                    // })
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
    onLoad: function (options) {
        // 订单提交页面进入type--0
        this.setData({
            type:options.type
        })


    },
    onReady: function () {

    },
    // 添加地址
    add: function () {
        wx.navigateTo({
            url: '../add/add'
        });
    },
    // 设置默认地址
    // setDefault: function (e) {
	// 	// var that = this;
	// 	// 取得下标
	// 	var index = parseInt(e.currentTarget.dataset.index);
	// 	// 遍历所有地址对象设为非默认
	// 	var addressObjects = this.data.addressList;
	// 	for (let i = 0; i < addressObjects.length; i++) {
	// 		// 判断是否为当前地址，是则传true
    //         if(i==index){
    //             addressObjects[i].isDefault=true
    //         }else{
    //             addressObjects[i].isDefault=false
    //         }
	// 	}
    //     // 更新服务器上数据并更新本地实现刷新
    //     this.setData({
    //         addressList:addressObjects
    //     })
    // },
    // 编辑地址
	edit: function (e) {
		var index = parseInt(e.currentTarget.dataset.index);
        var editAddress=this.data.addressList[index]
        wx.setStorage({
            key:"address",
            data:editAddress
        })
		wx.navigateTo({
			url: '../add/add?id='+this.data.addressList[index].id
		});
	},
    // 删除地址
	del: function (e) {
        wx.showModal({
			title: '提示',
			content: '确认删除该收货地址？', 
			success: (res)=>{
                if (res.confirm) {
                    var afterDel = this.data.addressList
                    var index = parseInt(e.currentTarget.dataset.index);
                    wx.request({
                        url: h.main+'/main/deletusername.html',
                        data: {                                  
                            id: this.data.addressList[index].id,
                        saccountno:app.globalData.accountName,
                        sessionid: app.globalData.sessionid
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        },
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
                                        url: '../../../Login/index'
                                        })      
                                    }    
                                }    
                            }); 
                            break;
                            default:
                            console.log(index)
                            afterDel.splice(index,1)
                            this.setData({
                                addressList: afterDel,
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
				}
			})

	},
    // 订单页跳转选择地址
    // chooseAddress: function(e){
    //     // 非订单提交选择地址点击无效返回
    //     if(this.data.type!=0){
    //         return
    //     }
    //     var addressIndex = e.currentTarget.dataset.index
    //     var pages = getCurrentPages();
    //     if(pages.length > 1){
    //         var prePage = pages[pages.length - 2];
    //         prePage.backAddress(this.data.addressList[addressIndex])
    //     }
    //     wx.navigateBack()
    // }

})