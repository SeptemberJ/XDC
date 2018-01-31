
import h from '../../../utils/url.js'
var app = getApp()
Page({
  data: {
    seInfo:{"name":'物流商A',"orderAmount":3,"done":1},
    percentT:'',
    recycleList:[],
    loadingHidden:false,
    id:''
  },
  onLoad: function(options) {
      this.setData({
          id:options.id      
      })

  },
    onShow: function(){
      console.log('onshow=====')
        wx.request({
            url: h.main+'/page/listbyrecopp.html',
            data: {
                laccountno: this.data.id,
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
                              url: '../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('仓库回单详情back orderInfo--------')
                console.log(res.data)
                this.setData({
                    recycleList:res.data,
                    loadingHidden:true,
                })
                }
                
            },
            fail: (res)=>{
                // fail
            },
            complete:(res)=>{
                // complete
            }
            }) 
      
  },
//   进入入库编辑页面
    toDetail: function(e){
      var idx = parseInt(e.currentTarget.dataset.index)
      wx.navigateTo({
        url: '../OrderList/index?id=' + this.data.recycleList[1][idx].recycleno,
      })

      // var idx = parseInt(e.currentTarget.dataset.index)
      // var Id = this.data.recycleList[1][idx].recycleno
      // var count = this.data.recycleList[1][idx].count
      // var countsupplier = this.data.recycleList[1][idx].countsupplier
      // if(count==countsupplier){
      //     wx.navigateTo({
			// url: '../putInStorage/index?recycleno='+Id
      //     });
      // }else{
      //     wx.showModal({    
      //               title:'提示',    
      //               content: '该回单还未完成!',      
      //               showCancel: false,    
      //               success: function (res) {    
      //                   if (res.confirm) {      
      //                   }    
      //               }    
      //     });
      // }
      
  }
})