const AV = require('../../../../utils/av-weapp.js')
import h from '../../../../utils/url.js'
var app = getApp()
Page({
    data: {
        addressList:[],
        // hasAddr:true,

    },
    onShow: function () {
          //获取地址列表
            var that = this
            wx.request({
            url: h.main+'/main/listByaddress.html',
            data: {
                saccountno:app.globalData.accountName
                // oppen_id: app.globalData.oppenid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',

            },

            success: function (res) {
                console.log('address data--------')
                console.log(res.data)
                var addressLists=[]
                addressLists.push(res.data[0])
                addressLists.push(res.data[1][0])
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
        // 生命周期函数--监听页面加载

    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    add: function () {
        wx.navigateTo({
            url: '../add/add?idnumber='+this.data.addressList.length
        });
    },
    // choose: function (e) {
    //     var that=this;
    //     console.log(e.currentTarget.id)
    //     var id = e.currentTarget.id;
    //     var pages = getCurrentPages();
    //     var prevPage = pages[pages.length - 2];
    //     console.log('in dizhilist----')
    //     console.log(pages)
    //     //总地址
    //     var addr_info = that.data.arr[id].province+that.data.arr[id].city+that.data.arr[id].area+that.data.arr[id].addr_name
    // console.log(addr_info)
    //     prevPage.setData({
    //         dizhi: that.data.arr[id].province,
    //         addr_user:that.data.arr[id].addr_user,
    //         addressInfo:addr_info,
    //         addr_tel:that.data.arr[id].addr_tel,
    //         addr_name:that.data.arr[id].addr_name
        
    //     })
    //     wx.navigateBack({
    //       delta: 1, // 回退前 delta(默认为1) 页面
    //       success: function(res){
    //         // success
    //       },
    //       fail: function() {
    //         // fail
    //       },
    //       complete: function() {
    //         // complete
    //       }
    //     })
    // },
	edit: function (e) {
        //url带入区分编辑还是新增
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
        var editAddress=this.data.addressList[index]
		// 取出id值
		// var objectId = this.data.addressObjects[index].get('objectId');
		console.log('------------')
		console.log(index)
        wx.setStorage({
            key:"address",
            data:editAddress
        })
		wx.navigateTo({
			url: '../add/add?objectId='+index+'&&id='+this.data.addressList[index].id
            // url: '../add/add?objectId='+objectId
		});
	},
	del: function (e) {
		var that = this;
        var afterDel = this.data.addressList
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
        wx.request({
            url: h.main+'/main/deletusername.html',
            data: {
                id: this.data.addressList[index].id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',

            },

            success: function (res) {
              
                console.log(index)
                
                afterDel.splice(index,1)
           console.log(afterDel)
                that.setData({
                addressList: afterDel,
                })
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
            })
        //考虑list中splice操作实现刷新效果 
	},

})